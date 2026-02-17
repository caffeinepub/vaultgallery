import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Album {
    id: string;
    owner: Principal;
    name: string;
    createdTime: Time;
    mediaIds: Array<string>;
    isHidden: boolean;
}
export interface VaultSetting {
    pinAttempts: bigint;
    isVaultLocked: boolean;
    pinHash?: string;
}
export type Time = bigint;
export interface PhotoEditing {
    filters?: Array<ImageFilter>;
    crop?: {
        x: bigint;
        y: bigint;
        height: bigint;
        width: bigint;
    };
    rotate?: number;
}
export interface LibraryMetadata {
    albums: Array<Album>;
    mediaItems: Array<MediaItem>;
    vaultSetting?: VaultSetting;
}
export type ImageFilter = {
    __kind__: "contrast";
    contrast: {
        level: number;
    };
} | {
    __kind__: "blur";
    blur: null;
} | {
    __kind__: "none";
    none: null;
} | {
    __kind__: "colorAdjustment";
    colorAdjustment: {
        red: bigint;
        blue: bigint;
        green: bigint;
    };
} | {
    __kind__: "brightness";
    brightness: {
        level: number;
    };
} | {
    __kind__: "sepia";
    sepia: null;
} | {
    __kind__: "grayscale";
    grayscale: null;
};
export interface MediaItem {
    id: string;
    title: string;
    originalBlob: ExternalBlob;
    editing?: PhotoEditing;
    owner: Principal;
    size: bigint;
    description: string;
    thumbnailBlob: ExternalBlob;
    mediaType: Variant_video_photo;
    isLocked: boolean;
    editedBlob?: ExternalBlob;
    uploadTime: Time;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_video_photo {
    video = "video",
    photo = "photo"
}
export interface backendInterface {
    addAlbum(album: Album): Promise<void>;
    addMediaItem(item: MediaItem): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAlbum(id: string): Promise<Album | null>;
    getAllAlbums(): Promise<Array<Album>>;
    getAllMedia(): Promise<Array<MediaItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLibraryMetadata(): Promise<LibraryMetadata | null>;
    getMediaItem(id: string): Promise<MediaItem | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVaultStatus(): Promise<VaultSetting | null>;
    isCallerAdmin(): Promise<boolean>;
    reorderAlbums(newOrder: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setVaultPIN(pinHash: string): Promise<void>;
    unlockVault(pin: string): Promise<boolean>;
}
