import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AndroidAccessHelpGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Android Installation Guide</CardTitle>
        <CardDescription>How to add this app to your home screen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            If you're having trouble finding the "View Live App" button in the Caffeine host UI, use the "App Link" section above to copy and open the link directly.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Step 1: Turn OFF Desktop Site</h3>
            <p className="text-sm text-muted-foreground mb-3">
              In Chrome, tap the three dots menu (⋮) in the top-right corner. Make sure "Desktop site" is turned OFF (unchecked). If it's ON, the page may not scroll properly.
            </p>
            <img
              src="/assets/generated/android-chrome-desktop-site-off-guide.dim_1080x1920.png"
              alt="Chrome menu showing Desktop site toggle OFF"
              className="w-full max-w-sm rounded-lg border"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Step 2: Refresh the Page</h3>
            <p className="text-sm text-muted-foreground">
              After turning OFF Desktop site, refresh the page to ensure proper mobile view.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Step 3: Add to Home Screen</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Open the Chrome menu again (⋮) and select "Add to Home screen". Give the app a name and tap "Add". The app icon will appear on your home screen.
            </p>
            <img
              src="/assets/generated/android-chrome-add-to-home-screen-guide.dim_1080x1920.png"
              alt="Chrome menu showing Add to home screen option"
              className="w-full max-w-sm rounded-lg border"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Alternative Method</h3>
            <p className="text-sm text-muted-foreground">
              Use the "Copy Link" button in the "App Link" section above, paste it into Chrome, and then follow the "Add to Home screen" steps.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
