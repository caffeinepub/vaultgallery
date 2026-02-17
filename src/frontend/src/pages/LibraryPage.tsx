import { useState } from 'react';
import { useGetAllMedia } from '../hooks/useLibrary';
import { useVaultState } from '../hooks/useVault';
import MediaUploader from '../components/media/MediaUploader';
import MediaGrid from '../components/media/MediaGrid';
import MediaViewerModal from '../components/media/MediaViewerModal';
import type { MediaItem } from '../backend';

export default function LibraryPage() {
  const { data: allMedia = [], isLoading } = useGetAllMedia();
  const { isUnlocked } = useVaultState();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const visibleMedia = allMedia.filter((item) => !item.isLocked || isUnlocked);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Library</h2>
            <p className="text-sm text-muted-foreground">
              {visibleMedia.length} {visibleMedia.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <MediaUploader />
        </div>

        {visibleMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <img
              src="/assets/generated/empty-gallery-illustration.dim_1200x800.png"
              alt="Empty gallery"
              className="mb-6 w-full max-w-md opacity-50"
            />
            <h3 className="mb-2 text-xl font-semibold">No media yet</h3>
            <p className="mb-6 text-muted-foreground">
              Upload your first photo or video to get started
            </p>
            <MediaUploader />
          </div>
        ) : (
          <MediaGrid items={visibleMedia} onItemClick={setSelectedItem} />
        )}
      </div>

      <MediaViewerModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
