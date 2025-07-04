'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { toast } = useToast();
    const [isSending, setIsSending] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>({
        resolver: zodResolver(contactSchema)
    });

    const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
        setIsSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Form Data:", data);
        
        setIsSending(false);
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We'll get back to you shortly.",
        });
        reset();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow container pt-8 pb-24 md:pt-12 md:pb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
                    <p className="text-muted-foreground mt-2">We'd love to hear from you. Get in touch with us.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                            <CardDescription>Fill out the form and we'll get back to you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name')} />
                                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                                </div>
                                 <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" {...register('subject')} />
                                    {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" rows={5} {...register('message')} />
                                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                                </div>
                                <Button type="submit" disabled={isSending}>
                                    {isSending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold font-headline">Contact Information</h2>
                         <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Our Address</h3>
                                <p className="text-muted-foreground">123 Bazaar Street, Dhaka, Bangladesh</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Email Us</h3>
                                <p className="text-muted-foreground">support@bazaargo.com</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Call Us</h3>
                                <p className="text-muted-foreground">+880 123 456 7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
