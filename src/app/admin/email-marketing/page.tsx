
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function EmailMarketingRedirectPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/marketing/email');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full">
            <p>Redirecting to the new Email Marketing page...</p>
        </div>
    );
}
