import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LoginScreen from './pages/LoginScreen';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import AppHeader from './components/layout/AppHeader';
import LibraryPage from './pages/LibraryPage';
import AlbumsPage from './pages/AlbumsPage';
import VaultPage from './pages/VaultPage';
import SettingsPage from './pages/SettingsPage';
import { useState } from 'react';

type View = 'library' | 'albums' | 'vault' | 'settings';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('library');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LoginScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (profileLoading || !isFetched) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen flex-col bg-background">
        <AppHeader currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 min-h-0 overflow-hidden">
          {currentView === 'library' && <LibraryPage />}
          {currentView === 'albums' && <AlbumsPage />}
          {currentView === 'vault' && <VaultPage />}
          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </ThemeProvider>
  );
}
