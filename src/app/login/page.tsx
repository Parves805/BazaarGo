import { AuthForm } from '@/components/auth-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
                <CardDescription>Log in to your BazaarGo account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <AuthForm type="login" />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                    Sign up
                    </Link>
                </p>
            </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
