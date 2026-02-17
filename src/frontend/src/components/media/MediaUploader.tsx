import { useState, useRef } from 'react';
import { useAddMediaItem } from '../../hooks/useLibrary';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, Variant_video_photo } from '../../backend';

export default function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMediaItem = useAddMediaItem();
  const { identity } = useInternetIdentity();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !identity) return;

    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
          toast.error(`Skipping ${file.name}: Only images and videos are supported`);
          continue;
        }

        const bytes = new Uint8Array(await file.arrayBuffer());
        
        const originalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          setProgress(Math.floor(percentage * 0.8));
        });

        const thumbnailBlob = await createThumbnail(file, isVideo);

        const mediaItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          owner: identity.getPrincipal(),
          title: file.name,
          description: '',
          mediaType: isVideo ? Variant_video_photo.video : Variant_video_photo.photo,
          uploadTime: BigInt(Date.now() * 1_000_000),
          size: BigInt(file.size),
          isLocked: false,
          originalBlob,
          thumbnailBlob,
        };

        setProgress(80 + (i / files.length) * 20);
        await addMediaItem.mutateAsync(mediaItem);
      }

      toast.success(`Successfully uploaded ${files.length} file(s)`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const createThumbnail = async (file: File, isVideo: boolean): Promise<ExternalBlob> => {
    return new Promise((resolve) => {
      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = (video.videoHeight / video.videoWidth) * 300;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              blob.arrayBuffer().then((buffer) => {
                resolve(ExternalBlob.fromBytes(new Uint8Array(buffer)));
              });
            }
          }, 'image/jpeg', 0.7);
        };
        video.src = URL.createObjectURL(file);
      } else {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              blob.arrayBuffer().then((buffer) => {
                resolve(ExternalBlob.fromBytes(new Uint8Array(buffer)));
              });
            }
          }, 'image/jpeg', 0.7);
        };
        img.src = URL.createObjectURL(file);
      }
    });
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        size="sm"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload Media'}
      </Button>
      {uploading && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>
      )}
    </div>
  );
}
