import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSetVaultPIN } from '../../hooks/useVault';

interface PinSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PinSetupModal({ open, onClose }: PinSetupModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const setVaultPIN = useSetVaultPIN();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    try {
      await setVaultPIN.mutateAsync(pin);
      toast.success('Vault PIN set successfully');
      onClose();
      setPin('');
      setConfirmPin('');
    } catch (error) {
      toast.error('Failed to set PIN');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Vault PIN</DialogTitle>
          <DialogDescription>
            Create a PIN to protect your locked items. You'll need this PIN to access the Vault.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN (minimum 4 digits)</Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={setVaultPIN.isPending} className="flex-1">
              {setVaultPIN.isPending ? 'Setting...' : 'Set PIN'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
