
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { initialCategories } from '@/lib/data';
import type { Category } from '@/lib/types';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES_KEY = 'appCategories';

const categorySchema = z.object({
    name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
    image: z.string().url({ message: 'A valid image URL is required.' }),
    bannerImage: z.string().url({ message: 'A valid banner image URL is required.' }),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '', image: '', bannerImage: '' },
    });

    useEffect(() => {
        const loadCategories = () => {
            try {
                const savedCategoriesJSON = localStorage.getItem(CATEGORIES_KEY);
                if (savedCategoriesJSON) {
                    const parsed = JSON.parse(savedCategoriesJSON);
                    if (Array.isArray(parsed)) {
                        setCategories(parsed);
                    } else {
                        setCategories(initialCategories);
                        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
                    }
                } else {
                    setCategories(initialCategories);
                    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
                }
            } catch (error) {
                console.error("Failed to load categories, re-initializing.", error);
                setCategories(initialCategories);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
        const interval = setInterval(loadCategories, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAddCategory = (data: CategoryFormValues) => {
        setIsSubmitting(true);
        const newId = slugify(data.name);

        setCategories(currentCategories => {
            if (currentCategories.some(c => c.id === newId)) {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "A category with this name already exists. Please choose a different name.",
                });
                setIsSubmitting(false);
                return currentCategories;
            }

            const newCategory: Category = {
                id: newId,
                name: data.name,
                image: data.image,
                bannerImage: data.bannerImage
            };
            const updatedCategories = [...currentCategories, newCategory];
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
            
            toast({
                title: "Category Added",
                description: `The category "${data.name}" has been successfully added.`,
            });
            
            setIsSubmitting(false);
            setIsAddDialogOpen(false);
            form.reset();
            return updatedCategories;
        });
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories(currentCategories => {
            const updatedCategories = currentCategories.filter(c => c.id !== categoryId);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
            toast({
                title: "Category Deleted",
                description: "The category has been successfully deleted.",
            });
            return updatedCategories;
        });
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl md:text-3xl">Categories</CardTitle>
                        <CardDescription>Manage your store categories here.</CardDescription>
                    </div>
                     <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleAddCategory)} className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Men's T-Shirts" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/image.png" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bannerImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Banner Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/banner.png" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Add Category
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <Skeleton className="h-16 w-16" />
                                    <div className="flex-grow space-y-2">
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            ))}
                        </div>
                    ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <Image
                                                alt={category.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={category.image || 'https://placehold.co/64x64.png'}
                                                width="64"
                                                data-ai-hint="product category"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the category.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    