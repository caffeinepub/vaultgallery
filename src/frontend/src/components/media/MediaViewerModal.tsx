import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Edit, Lock, Unlock } from 'lucide-react';
import type { MediaItem } from '../../backend';
import { Variant_video_photo } from '../../backend';
import { useState } from 'react';
import ImageEditorModal from '../editor/ImageEditorModal';

interface MediaViewerModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onToggleLock?: (item: MediaItem) => void;
}

export default function MediaViewerModal({ item, onClose, onToggleLock }: MediaViewerModalProps) {
  const [showEditor, setShowEditor] = useState(false);

  if (!item) return null;

  const isVideo = item.mediaType === Variant_video_photo.video;
  const displayBlob = item.editedBlob || item.originalBlob;
  const uploadDate = new Date(Number(item.uploadTime) / 1_000_000);

  return (
    <>
      <Dialog open={!!item} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl p-0">
          <div className="relative">
            <div className="absolute right-2 top-2 z-10 flex gap-2">
              {!isVideo && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setShowEditor(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onToggleLock && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => onToggleLock(item)}
                >
                  {item.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              )}
              <Button size="icon" variant="secondary" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex max-h-[80vh] items-center justify-center bg-black">
              {isVideo ? (
                <video
                  src={displayBlob.getDirectURL()}
                  controls
                  className="max-h-[80vh] w-full"
                />
              ) : (
                <img
                  src={displayBlob.getDirectURL()}
                  alt={item.title}
                  className="max-h-[80vh] w-full object-contain"
                />
              )}
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Type: {isVideo ? 'Video' : 'Photo'}</p>
                <p>Uploaded: {uploadDate.toLocaleDateString()}</p>
                <p>Size: {formatBytes(Number(item.size))}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {showEditor && !isVideo && (
        <ImageEditorModal
          item={item}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
