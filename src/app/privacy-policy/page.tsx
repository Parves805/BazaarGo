
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BazaarGo',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Privacy Policy</CardTitle>
                    <CardDescription>Our commitment to your privacy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>BazaarGo ("us", "we", or "our") operates the BazaarGo website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
                    
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">Information Collection and Use</h3>
                        <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, your name, email address, phone number, and shipping address.</p>
                    </div>

                    <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Log Data</h3>
                         <p>We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>
                    </div>

                     <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Security of Data</h3>
                         <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                    </div>

                    <div className="space-y-2">
                         <h3 className="font-semibold text-lg text-foreground">Changes to This Privacy Policy</h3>
                         <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
                    </div>

                </CardContent>
            </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
