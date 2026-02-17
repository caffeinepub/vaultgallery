import { useState, useEffect, useRef } from 'react';
import type { MediaItem } from '../../backend';
import { Variant_video_photo } from '../../backend';
import { Play } from 'lucide-react';

interface MediaGridProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}

export default function MediaGrid({ items, onItemClick }: MediaGridProps) {
  const [visibleItems, setVisibleItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    setVisibleItems(items.slice(0, itemsPerPage));
    setPage(1);
  }, [items]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleItems.length < items.length) {
          const nextPage = page + 1;
          const newItems = items.slice(0, nextPage * itemsPerPage);
          setVisibleItems(newItems);
          setPage(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [items, visibleItems.length, page]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted transition-transform hover:scale-105"
            onClick={() => onItemClick(item)}
          >
            <img
              src={item.thumbnailBlob.getDirectURL()}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {item.mediaType === Variant_video_photo.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleItems.length < items.length && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
