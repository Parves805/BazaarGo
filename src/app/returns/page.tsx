import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Return Policy | BazaarGo',
};

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <Undo2 className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Return Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>We want you to be completely satisfied with your purchase. If you're not happy for any reason, you can return most items for a full refund or exchange within <strong>30 days</strong> of the delivery date.</p>
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-foreground">Conditions for Return:</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Items must be in new, unworn, and unwashed condition.</li>
                            <li>Original tags must still be attached.</li>
                            <li>Items must be returned in their original packaging.</li>
                            <li>Final sale items are not eligible for return or exchange.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">How to Start a Return:</h3>
                         <p>To initiate a return, please visit your "My Orders" page and select the order containing the item you wish to return. If you checked out as a guest, please contact our support team with your order number.</p>
                    </div>

                     <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Refunds:</h3>
                         <p>Once we receive and inspect your return, we will process your refund to the original payment method within 5-7 business days. You will receive an email notification once the refund has been issued.</p>
                    </div>
                    
                    <div className="text-center pt-4">
                        <Link href="/contact">
                            <Button>Contact Support for Help</Button>
                        </Link>
                    </div>

                </CardContent>
            </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
