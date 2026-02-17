import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Image, FolderOpen, Lock, Settings } from 'lucide-react';

type View = 'library' | 'albums' | 'vault' | 'settings';

interface AppHeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function AppHeader({ currentView, onViewChange }: AppHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/app-logo.dim_512x512.png" alt="Vault Gallery" className="h-10 w-10" />
            <h1 className="text-xl font-bold">Vault Gallery</h1>
          </div>
          <nav className="flex gap-1">
            <Button
              variant={currentView === 'library' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('library')}
            >
              <Image className="mr-2 h-4 w-4" />
              Library
            </Button>
            <Button
              variant={currentView === 'albums' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('albums')}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Albums
            </Button>
            <Button
              variant={currentView === 'vault' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('vault')}
            >
              <Lock className="mr-2 h-4 w-4" />
              Vault
            </Button>
            <Button
              variant={currentView === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
        <LoginButton />
      </div>
    </header>
  );
}
