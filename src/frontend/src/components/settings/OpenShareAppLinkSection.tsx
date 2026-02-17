import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function OpenShareAppLinkSection() {
  const currentUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Link</CardTitle>
        <CardDescription>Share or open this app in a new tab</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-3">
          <p className="break-all text-sm font-mono">{currentUrl}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopyLink} variant="outline" className="flex-1">
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button onClick={handleOpenInNewTab} variant="outline" className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
