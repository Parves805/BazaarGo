import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Settings className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-3xl font-bold font-headline">Settings</CardTitle>
                        <CardDescription>Adjust your application settings.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Application settings will be available here.</p>
                </div>
            </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
