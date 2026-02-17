import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type VaultSetting = {
    pinHash : ?Text;
    pinAttempts : Nat;
    isVaultLocked : Bool;
  };

  type ImageFilter = {
    #none;
    #sepia;
    #grayscale;
    #blur;
    #brightness : {
      level : Float;
    };
    #contrast : {
      level : Float;
    };
    #colorAdjustment : {
      red : Int;
      green : Int;
      blue : Int;
    };
  };

  type PhotoEditing = {
    crop : ?{ x : Int; y : Int; width : Int; height : Int };
    rotate : ?Float;
    filters : ?[ImageFilter];
  };

  type MediaItem = {
    id : Text;
    owner : Principal;
    title : Text;
    description : Text;
    mediaType : { #photo; #video };
    uploadTime : Time.Time;
    size : Nat;
    isLocked : Bool;
    originalBlob : Storage.ExternalBlob;
    thumbnailBlob : Storage.ExternalBlob;
    editedBlob : ?Storage.ExternalBlob;
    editing : ?PhotoEditing;
  };

  type Album = {
    id : Text;
    owner : Principal;
    name : Text;
    mediaIds : [Text];
    isHidden : Bool;
    createdTime : Time.Time;
  };

  type LibraryMetadata = {
    mediaItems : [MediaItem];
    albums : [Album];
    vaultSetting : ?VaultSetting;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let albumsStorage = Map.empty<Principal, Map.Map<Text, Album>>();
  let mediaItemsStorage = Map.empty<Principal, Map.Map<Text, MediaItem>>();
  let vaultSettings = Map.empty<Principal, VaultSetting>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Vault Management
  public query ({ caller }) func getVaultStatus() : async ?VaultSetting {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access vault settings");
    };
    vaultSettings.get(caller);
  };

  public shared ({ caller }) func setVaultPIN(pinHash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set vault PIN");
    };
    let vaultSetting : VaultSetting = {
      pinHash = ?pinHash;
      pinAttempts = 0;
      isVaultLocked = true;
    };
    vaultSettings.add(caller, vaultSetting);
  };

  public shared ({ caller }) func unlockVault(pin : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock vault");
    };
    switch (vaultSettings.get(caller)) {
      case (?vaultSetting) {
        if (vaultSetting.pinHash == ?pin) {
          let newSetting : VaultSetting = {
            pinHash = vaultSetting.pinHash;
            pinAttempts = 0;
            isVaultLocked = false;
          };
          vaultSettings.add(caller, newSetting);
          true;
        } else {
          false;
        };
      };
      case (null) { Runtime.trap("Vault not initialized") };
    };
  };

  // Media Item Management
  public shared ({ caller }) func addMediaItem(item : MediaItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add media items");
    };
    // Verify ownership
    if (item.owner != caller) {
      Runtime.trap("Unauthorized: Cannot add media item for another user");
    };
    let callerMediaItemsStorage = switch (mediaItemsStorage.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, MediaItem>();
        mediaItemsStorage.add(caller, newMap);
        newMap;
      };
      case (?map) { map };
    };

    callerMediaItemsStorage.add(item.id, item);
  };

  public query ({ caller }) func getMediaItem(id : Text) : async ?MediaItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access media items");
    };
    switch (mediaItemsStorage.get(caller)) {
      case (null) { null };
      case (?mediaItems) { mediaItems.get(id) };
    };
  };

  public query ({ caller }) func getAllMedia() : async [MediaItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access media library");
    };
    switch (mediaItemsStorage.get(caller)) {
      case (null) { [] };
      case (?mediaItems) { mediaItems.values().toArray() };
    };
  };

  // Album Management
  public shared ({ caller }) func addAlbum(album : Album) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add albums");
    };
    // Verify ownership
    if (album.owner != caller) {
      Runtime.trap("Unauthorized: Cannot add album for another user");
    };
    let callerAlbumsStorage = switch (albumsStorage.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, Album>();
        albumsStorage.add(caller, newMap);
        newMap;
      };
      case (?map) { map };
    };

    callerAlbumsStorage.add(album.id, album);
  };

  public query ({ caller }) func getAlbum(id : Text) : async ?Album {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access albums");
    };
    switch (albumsStorage.get(caller)) {
      case (null) { null };
      case (?albums) { albums.get(id) };
    };
  };

  public shared ({ caller }) func reorderAlbums(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reorder albums");
    };
    switch (albumsStorage.get(caller)) {
      case (null) {
        Runtime.trap("No albums found for this user");
      };
      case (?albums) {
        let reorderedAlbums = Map.empty<Text, Album>();
        let orderedAlbums : List.List<(Text, Album)> = List.empty<(Text, Album)>();

        for (id in newOrder.values()) {
          switch (albums.get(id)) {
            case (?album) {
              orderedAlbums.add((id, album));
            };
            case (null) {};
          };
        };

        for ((id, album) in orderedAlbums.values()) {
          reorderedAlbums.add(id, album);
        };

        albumsStorage.add(caller, reorderedAlbums);
      };
    };
  };

  public query ({ caller }) func getAllAlbums() : async [Album] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access albums");
    };
    switch (albumsStorage.get(caller)) {
      case (null) { [] };
      case (?albums) { albums.values().toArray() };
    };
  };

  // Library Metadata Export/Import
  public query ({ caller }) func getLibraryMetadata() : async ?LibraryMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access library metadata");
    };
    let mediaItems = switch (mediaItemsStorage.get(caller)) {
      case (null) { [] };
      case (?mediaItems) { mediaItems.values().toArray() };
    };

    let albums = switch (albumsStorage.get(caller)) {
      case (null) { [] };
      case (?albums) { albums.values().toArray() };
    };

    let vaultSetting = vaultSettings.get(caller);

    ?{
      mediaItems;
      albums;
      vaultSetting;
    };
  };
};
