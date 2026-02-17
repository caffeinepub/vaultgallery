import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { MediaItem } from '../../backend';
import { ExternalBlob } from '../../backend';
import { useAddMediaItem } from '../../hooks/useLibrary';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { applyImageEdits } from '../../utils/imageEditing';

interface ImageEditorModalProps {
  item: MediaItem;
  onClose: () => void;
}

type FilterType = 'none' | 'grayscale' | 'sepia' | 'vivid';

export default function ImageEditorModal({ item, onClose }: ImageEditorModalProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState<FilterType>('none');
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const addMediaItem = useAddMediaItem();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOriginalImage(img);
      renderImage(img);
    };
    img.src = item.originalBlob.getDirectURL();
  }, [item]);

  useEffect(() => {
    if (originalImage) {
      renderImage(originalImage);
    }
  }, [brightness, contrast, rotation, filter, originalImage]);

  const renderImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const angle = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    
    canvas.width = img.width * cos + img.height * sin;
    canvas.height = img.width * sin + img.height * cos;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    
    if (filter === 'grayscale') {
      ctx.filter += ' grayscale(100%)';
    } else if (filter === 'sepia') {
      ctx.filter += ' sepia(100%)';
    } else if (filter === 'vivid') {
      ctx.filter += ' saturate(150%)';
    }

    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  };

  const handleSaveAsCopy = async () => {
    if (!canvasRef.current || !identity) return;

    setSaving(true);
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/jpeg', 0.9);
      });

      const bytes = new Uint8Array(await blob.arrayBuffer());
      const editedBlob = ExternalBlob.fromBytes(bytes);
      const thumbnailBlob = await createThumbnail(blob);

      const newItem: MediaItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        owner: identity.getPrincipal(),
        title: `${item.title} (edited)`,
        description: item.description,
        mediaType: item.mediaType,
        uploadTime: BigInt(Date.now() * 1_000_000),
        size: BigInt(bytes.length),
        isLocked: false,
        originalBlob: editedBlob,
        thumbnailBlob,
      };

      await addMediaItem.mutateAsync(newItem);
      toast.success('Saved as new copy');
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save edited image');
    } finally {
      setSaving(false);
    }
  };

  const createThumbnail = async (blob: Blob): Promise<ExternalBlob> => {
    return new Promise((resolve) => {
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
        canvas.toBlob((b) => {
          if (b) {
            b.arrayBuffer().then((buffer) => {
              resolve(ExternalBlob.fromBytes(new Uint8Array(buffer)));
            });
          }
        }, 'image/jpeg', 0.7);
      };
      img.src = URL.createObjectURL(blob);
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center bg-black rounded-lg overflow-hidden">
            <canvas ref={canvasRef} className="max-h-[50vh]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brightness: {brightness}%</Label>
              <Slider
                value={[brightness]}
                onValueChange={(v) => setBrightness(v[0])}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Contrast: {contrast}%</Label>
              <Slider
                value={[contrast]}
                onValueChange={(v) => setContrast(v[0])}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Rotation: {rotation}°</Label>
              <Slider
                value={[rotation]}
                onValueChange={(v) => setRotation(v[0])}
                min={0}
                max={360}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Filter</Label>
              <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="sepia">Sepia</SelectItem>
                  <SelectItem value="vivid">Vivid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveAsCopy} disabled={saving}>
              {saving ? 'Saving...' : 'Save as Copy'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
