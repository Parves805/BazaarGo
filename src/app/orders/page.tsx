import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <ListOrdered className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-3xl font-bold font-headline">My Orders</CardTitle>
                        <CardDescription>View your order history and status.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You have not placed any orders yet.</p>
                </div>
            </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
