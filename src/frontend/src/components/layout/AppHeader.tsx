import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Image, FolderOpen, Lock, Settings, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

type View = 'library' | 'albums' | 'vault' | 'settings';

interface AppHeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function AppHeader({ currentView, onViewChange }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewChange = (view: View) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { view: 'library' as View, icon: Image, label: 'Library' },
    { view: 'albums' as View, icon: FolderOpen, label: 'Albums' },
    { view: 'vault' as View, icon: Lock, label: 'Vault' },
    { view: 'settings' as View, icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="shrink-0 border-b bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-3 md:h-16 md:px-4">
        {/* Logo - always visible */}
        <div className="flex items-center gap-2 md:gap-3">
          <img src="/assets/generated/app-logo.dim_512x512.png" alt="Vault Gallery" className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
          <h1 className="text-base font-bold md:text-xl whitespace-nowrap">Vault Gallery</h1>
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden md:flex gap-1">
          {navItems.map(({ view, icon: Icon, label }) => (
            <Button
              key={view}
              variant={currentView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(view)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Desktop login button */}
          <div className="hidden md:block">
            <LoginButton />
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map(({ view, icon: Icon, label }) => (
                  <Button
                    key={view}
                    variant={currentView === view ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleViewChange(view)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <LoginButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
