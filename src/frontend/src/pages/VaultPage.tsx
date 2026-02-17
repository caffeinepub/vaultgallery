import { useState } from 'react';
import { useGetAllMedia } from '../hooks/useLibrary';
import { useGetVaultStatus, useVaultState } from '../hooks/useVault';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import PinSetupModal from '../components/vault/PinSetupModal';
import VaultUnlockModal from '../components/vault/VaultUnlockModal';
import MediaGrid from '../components/media/MediaGrid';
import MediaViewerModal from '../components/media/MediaViewerModal';
import type { MediaItem } from '../backend';

export default function VaultPage() {
  const { data: allMedia = [], isLoading: mediaLoading } = useGetAllMedia();
  const { data: vaultStatus, isLoading: vaultLoading } = useGetVaultStatus();
  const { isUnlocked, unlock } = useVaultState();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const lockedMedia = allMedia.filter((item) => item.isLocked);
  const hasPIN = vaultStatus?.pinHash !== undefined && vaultStatus?.pinHash !== null;

  if (mediaLoading || vaultLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading vault...</p>
        </div>
      </div>
    );
  }

  if (!hasPIN) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">Vault Not Set Up</h2>
            <p className="text-muted-foreground">
              Create a PIN to start protecting your private photos and videos
            </p>
          </div>
          <Button onClick={() => setShowPinSetup(true)}>
            Set Up Vault PIN
          </Button>
        </div>
        <PinSetupModal open={showPinSetup} onClose={() => setShowPinSetup(false)} />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">Vault Locked</h2>
            <p className="text-muted-foreground">
              Enter your PIN to access locked items
            </p>
          </div>
          <Button onClick={() => setShowUnlock(true)}>
            Unlock Vault
          </Button>
        </div>
        <VaultUnlockModal
          open={showUnlock}
          onClose={() => setShowUnlock(false)}
          onUnlock={unlock}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Vault</h2>
            <p className="text-sm text-muted-foreground">
              {lockedMedia.length} locked {lockedMedia.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {lockedMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted">
              <Lock className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No locked items</h3>
            <p className="text-muted-foreground">
              Lock photos and videos from your library to keep them private
            </p>
          </div>
        ) : (
          <MediaGrid items={lockedMedia} onItemClick={setSelectedItem} />
        )}
      </div>

      <MediaViewerModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
