export interface ImageEdits {
  brightness: number;
  contrast: number;
  rotation: number;
  filter: 'none' | 'grayscale' | 'sepia' | 'vivid';
}

export async function applyImageEdits(
  imageUrl: string,
  edits: ImageEdits
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const angle = (edits.rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      
      canvas.width = img.width * cos + img.height * sin;
      canvas.height = img.width * sin + img.height * cos;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.filter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%)`;
      
      if (edits.filter === 'grayscale') {
        ctx.filter += ' grayscale(100%)';
      } else if (edits.filter === 'sepia') {
        ctx.filter += ' sepia(100%)';
      } else if (edits.filter === 'vivid') {
        ctx.filter += ' saturate(150%)';
      }

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          blob.arrayBuffer().then((buffer) => {
            resolve(new Uint8Array(buffer));
          });
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.9);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}
