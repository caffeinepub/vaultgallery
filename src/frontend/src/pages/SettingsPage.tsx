import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, AlertTriangle, Heart } from 'lucide-react';
import { useGetLibraryMetadata } from '../hooks/useLibrary';
import { toast } from 'sonner';
import OpenShareAppLinkSection from '../components/settings/OpenShareAppLinkSection';
import AndroidAccessHelpGuide from '../components/settings/AndroidAccessHelpGuide';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: metadata } = useGetLibraryMetadata();

  const handleExport = () => {
    if (!metadata) {
      toast.error('No data to export');
      return;
    }

    const dataStr = JSON.stringify(metadata, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-gallery-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported successfully');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        JSON.parse(text);
        toast.info('Import functionality coming soon');
      } catch (error) {
        toast.error('Invalid backup file');
      }
    };
    input.click();
  };

  const appIdentifier = encodeURIComponent(window.location.hostname || 'vault-gallery');

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your gallery preferences and data
          </p>
        </div>

        <OpenShareAppLinkSection />

        <AndroidAccessHelpGuide />

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Vault Gallery looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
            <CardDescription>Export or import your gallery data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Third-party cloud backup (e.g., Google Drive) is not included.
                Storage limits may apply based on your Internet Computer canister capacity.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Export Backup
              </Button>
              <Button onClick={handleImport} variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Import Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        <footer className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with{' '}
            <Heart className="inline h-4 w-4 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
