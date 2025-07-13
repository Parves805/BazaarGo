
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, PlusCircle, View, GripVertical } from 'lucide-react';
import type { HomepageSection, Category } from '@/lib/types';
import { initialCategories } from '@/lib/data';

const HOMEPAGE_SECTIONS_KEY = 'homepageSections';
const CATEGORIES_KEY = 'appCategories';

const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  mainImageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  categorySlug: z.string().min(1, { message: "Please select a category." }),
});

const formSchema = z.object({
  sections: z.array(sectionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function HomepageSectionsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { sections: [] },
    });

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: 'sections',
    });

    useEffect(() => {
        try {
            const savedCategoriesJSON = localStorage.getItem(CATEGORIES_KEY);
            setCategories(savedCategoriesJSON ? JSON.parse(savedCategoriesJSON) : initialCategories);
            
            const savedSectionsJSON = localStorage.getItem(HOMEPAGE_SECTIONS_KEY);
            const savedSections = savedSectionsJSON ? JSON.parse(savedSectionsJSON) : [];
            form.reset({ sections: savedSections });

        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        } finally {
            setIsMounted(true);
        }
    }, [form]);

    const onSubmit = (data: FormValues) => {
        setIsLoading(true);
        try {
            localStorage.setItem(HOMEPAGE_SECTIONS_KEY, JSON.stringify(data.sections));
            toast({
                title: "Homepage Sections Saved",
                description: "Your homepage layout has been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save homepage sections.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addNewSection = () => {
        append({
            id: `section_${Date.now()}`,
            title: 'New Section',
            mainImageUrl: 'https://placehold.co/500x500.png',
            categorySlug: '',
        });
    };
    
    if (!isMounted) {
        return <p>Loading section settings...</p>;
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2"><View /> Homepage Sections</h1>
                    <p className="text-muted-foreground">Manage the content sections displayed on your homepage.</p>
                </div>
                <Button onClick={addNewSection}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
            </div>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {fields.map((field, index) => (
                    <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1.5">
                                <CardTitle>Section {index + 1}</CardTitle>
                                <CardDescription>Drag to reorder sections.</CardDescription>
                            </div>
                            <Button variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Remove Section</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name={`sections.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section Title</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`sections.${index}.categorySlug`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Category to Display</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`sections.${index}.mainImageUrl`}
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Main Image URL</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save All Sections
                    </Button>
                </div>
            </form>
            </Form>
        </div>
    );
}
