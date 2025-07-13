
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, PlusCircle, SquareCheck } from 'lucide-react';
import type { PromoCard } from '@/lib/types';
import { initialCategories } from '@/lib/data';

const PROMO_CARDS_KEY = 'promoCards';

const cardSchema = z.object({
  id: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  link: z.string().min(1, { message: "Link is required (e.g., /category/your-slug)." }),
});

const formSchema = z.object({
  cards: z.array(cardSchema),
});

type FormValues = z.infer<typeof formSchema>;

const defaultCards: PromoCard[] = [
    { id: '1', title: 'Classic Polo', imageUrl: 'https://fabrilife.com/products/650182af39a77-square.jpeg', link: '/category/polo-tshirt' },
    { id: '2', title: 'Designer Polo', imageUrl: 'https://img.drz.lazcdn.com/g/p/mdc/d08e501aee3431a41857876ab4646a5a.jpg_720x720q80.jpg', link: '/category/polo-tshirt' },
    { id: '3', title: 'Kids Polo', imageUrl: 'https://placehold.co/400x500.png', link: '/category/polo-tshirt' },
];

export default function PromoCardsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { cards: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'cards',
    });

    useEffect(() => {
        try {
            const savedCardsJSON = localStorage.getItem(PROMO_CARDS_KEY);
            const savedCards = savedCardsJSON ? JSON.parse(savedCardsJSON) : defaultCards;
            form.reset({ cards: savedCards });
        } catch (error) {
            console.error("Failed to load promo cards from localStorage", error);
        } finally {
            setIsMounted(true);
        }
    }, [form]);

    const onSubmit = (data: FormValues) => {
        setIsLoading(true);
        try {
            localStorage.setItem(PROMO_CARDS_KEY, JSON.stringify(data.cards));
            toast({
                title: "Promo Cards Saved",
                description: "Your promotional cards have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save promo cards.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addNewCard = () => {
        append({
            id: `card_${Date.now()}`,
            title: 'New Promo Card',
            imageUrl: 'https://placehold.co/400x500.png',
            link: '/shop',
        });
    };
    
    if (!isMounted) {
        return <p>Loading promo card settings...</p>;
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2"><SquareCheck /> Promo Cards</h1>
                    <p className="text-muted-foreground">Manage the large promotional cards on your homepage.</p>
                </div>
                <Button onClick={addNewCard}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Card
                </Button>
            </div>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Card {index + 1}</CardTitle>
                                <Button variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                    <span className="sr-only">Remove Card</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name={`cards.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`cards.${index}.link`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link URL</FormLabel>
                                            <FormControl><Input {...field} placeholder="/category/slug" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`cards.${index}.imageUrl`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save All Cards
                    </Button>
                </div>
            </form>
            </Form>
        </div>
    );
}
