
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BazaarGo',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Terms of Service</CardTitle>
                     <CardDescription>The rules for using our service.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the BazaarGo website (the "Service") operated by BazaarGo ("us", "we", or "our").</p>
                    
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">Accounts</h3>
                        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                    </div>

                    <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Intellectual Property</h3>
                         <p>The Service and its original content, features, and functionality are and will remain the exclusive property of BazaarGo and its licensors. The Service is protected by copyright, trademark, and other laws of both the and foreign countries.</p>
                    </div>

                     <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Termination</h3>
                         <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
                    </div>

                    <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Governing Law</h3>
                         <p>These Terms shall be governed and construed in accordance with the laws of our country, without regard to its conflict of law provisions.</p>
                    </div>

                </CardContent>
            </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
