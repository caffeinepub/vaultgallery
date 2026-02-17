import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUnlockVault } from '../../hooks/useVault';

interface VaultUnlockModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function VaultUnlockModal({ open, onClose, onUnlock }: VaultUnlockModalProps) {
  const [pin, setPin] = useState('');
  const unlockVault = useUnlockVault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pin) {
      toast.error('Please enter your PIN');
      return;
    }

    try {
      const success = await unlockVault.mutateAsync(pin);
      if (success) {
        toast.success('Vault unlocked');
        onUnlock();
        onClose();
        setPin('');
      } else {
        toast.error('Incorrect PIN');
        setPin('');
      }
    } catch (error) {
      toast.error('Failed to unlock vault');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Vault</DialogTitle>
          <DialogDescription>
            Enter your PIN to access locked items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={unlockVault.isPending} className="flex-1">
              {unlockVault.isPending ? 'Unlocking...' : 'Unlock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
