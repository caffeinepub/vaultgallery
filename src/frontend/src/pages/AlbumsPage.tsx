import { useState } from 'react';
import { useGetAllAlbums, useAddAlbum } from '../hooks/useAlbums';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function AlbumsPage() {
  const { data: albums = [], isLoading } = useGetAllAlbums();
  const addAlbum = useAddAlbum();
  const { identity } = useInternetIdentity();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [albumName, setAlbumName] = useState('');

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName.trim() || !identity) return;

    try {
      await addAlbum.mutateAsync({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        owner: identity.getPrincipal(),
        name: albumName.trim(),
        mediaIds: [],
        isHidden: false,
        createdTime: BigInt(Date.now() * 1_000_000),
      });
      toast.success('Album created');
      setAlbumName('');
      setShowCreateDialog(false);
    } catch (error) {
      toast.error('Failed to create album');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Albums</h2>
            <p className="text-sm text-muted-foreground">
              {albums.length} {albums.length === 1 ? 'album' : 'albums'}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAlbum} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="albumName">Album Name</Label>
                  <Input
                    id="albumName"
                    placeholder="Enter album name"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addAlbum.isPending} className="flex-1">
                    {addAlbum.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <img
              src="/assets/generated/empty-albums-illustration.dim_1200x800.png"
              alt="No albums"
              className="mb-6 w-full max-w-md opacity-50"
            />
            <h3 className="mb-2 text-xl font-semibold">No albums yet</h3>
            <p className="mb-6 text-muted-foreground">
              Create your first album to organize your media
            </p>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Album
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAlbum} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="albumName">Album Name</Label>
                    <Input
                      id="albumName"
                      placeholder="Enter album name"
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addAlbum.isPending} className="flex-1">
                      {addAlbum.isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:shadow-lg"
              >
                <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted">
                  <FolderOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="truncate font-semibold">{album.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {album.mediaIds.length} {album.mediaIds.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
