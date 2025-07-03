import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | BazaarGo',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
            <p className="text-muted-foreground mt-2">We'd love to hear from you! Reach out with any questions or feedback.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g. Question about an order" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Mail className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Email Us</CardTitle>
                            <CardDescription>for general inquiries</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <a href="mailto:support@bazaargo.com" className="text-lg font-semibold hover:text-primary">
                            support@bazaargo.com
                        </a>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Phone className="h-8 w-8 text-primary" />
                         <div>
                            <CardTitle>Call Us</CardTitle>
                            <CardDescription>Mon-Fri, 9am-5pm EST</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <a href="tel:+1234567890" className="text-lg font-semibold hover:text-primary">
                            +1 (234) 567-890
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
