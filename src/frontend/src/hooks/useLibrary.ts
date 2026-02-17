import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MediaItem } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetAllMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaItem[]>({
    queryKey: ['media'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedia();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMediaItem(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaItem | null>({
    queryKey: ['media', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMediaItem(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddMediaItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MediaItem) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addMediaItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useGetLibraryMetadata() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['libraryMetadata'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLibraryMetadata();
    },
    enabled: !!actor && !isFetching,
  });
}
