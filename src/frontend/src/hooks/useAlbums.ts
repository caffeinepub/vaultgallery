import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Album } from '../backend';

export function useGetAllAlbums() {
  const { actor, isFetching } = useActor();

  return useQuery<Album[]>({
    queryKey: ['albums'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAlbums();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAlbum(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Album | null>({
    queryKey: ['albums', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAlbum(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (album: Album) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addAlbum(album);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useReorderAlbums() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reorderAlbums(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}
