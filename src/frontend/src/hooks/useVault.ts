import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useState, useCallback } from 'react';

export function useGetVaultStatus() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['vaultStatus'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVaultStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetVaultPIN() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pinHash: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setVaultPIN(pinHash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaultStatus'] });
    },
  });
}

export function useUnlockVault() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pin: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlockVault(pin);
    },
  });
}

export function useVaultState() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const lock = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  const unlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  return { isUnlocked, lock, unlock };
}
