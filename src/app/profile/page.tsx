import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                 <div className="flex items-center gap-4">
                    <UserCircle className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-3xl font-bold font-headline">My Profile</CardTitle>
                        <CardDescription>Manage your account details and preferences.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Profile information will be displayed here.</p>
                </div>
            </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
