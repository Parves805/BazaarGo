'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define keys
const ALL_USERS_KEY = 'bazaargoAllUsers';
const USER_PROFILE_KEY = 'userProfile';

const loginSchema = z.object({
  email: z.string().email({
    message: 'আপনার ইমেল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে একটি সঠিক ইমেল ব্যবহার করুন।',
  }),
  password: z.string().min(1, { message: 'পাসওয়ার্ড প্রয়োজন।' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'নাম কমপক্ষে ২টি অক্ষরের হতে হবে।' }),
  email: z.string().email({
    message: 'আপনার ইমেল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে একটি সঠিক ইমেল ব্যবহার করুন।',
  }),
  password: z.string().min(8, {
    message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
  }),
});

interface AuthFormProps {
  type: 'login' | 'signup';
}

interface User {
    name: string;
    email: string;
}

export function AuthForm({ type }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = type === 'login' ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mock API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (type === 'signup') {
        try {
            const allUsersJson = localStorage.getItem(ALL_USERS_KEY);
            let allUsers: User[] = allUsersJson ? JSON.parse(allUsersJson) : [];
            
            const emailExists = allUsers.some(user => user.email === values.email);
            if (emailExists) {
                toast({
                    variant: 'destructive',
                    title: 'Signup Failed',
                    description: 'An account with this email already exists.',
                });
                setIsLoading(false);
                return;
            }

            const newUser: User = { name: values.name!, email: values.email };
            allUsers.push(newUser);
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
            
            // Also save to profile for auto-login
            const profileToSave = {
                savedUser: {
                    name: newUser.name,
                    email: newUser.email,
                    phone: '',
                    address: { street: '', city: '', state: '', zip: '' },
                    avatar: '',
                },
                savedPic: null,
            };
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileToSave));

            localStorage.setItem('isAuthenticated', 'true');
            toast({
                title: 'Signup Successful',
                description: 'Your account has been created.',
            });

        } catch (error) {
            console.error('Signup error:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create your account.' });
            setIsLoading(false);
            return;
        }

    } else { // Login
        localStorage.setItem('isAuthenticated', 'true');
        toast({
            title: 'Login Successful',
            description: `Welcome back!`,
        });
    }

    setIsLoading(false);
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {type === 'signup' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            type === 'login' ? 'Log In' : 'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
