
'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { products as initialProducts } from '@/lib/data';

const PRODUCTS_KEY = 'appProducts';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().min(0, { message: 'Stock must be a positive number.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  brand: z.string().min(2, { message: 'Brand is required.' }),
  images: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).min(1, "At least one image is required."),
  sizes: z.array(z.object({ value: z.string().min(1, "Size cannot be empty.") })).min(1, "At least one size is required."),
  tags: z.array(z.object({ value: z.string().min(1, "Tag cannot be empty.") })),
  colors: z.array(z.object({
    name: z.string().min(1, "Color name cannot be empty."),
    hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex code (e.g., #RRGGBB).")
  })).min(1, "At least one color is required."),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const id = params.id as string | undefined;
    const isEditMode = !!id;

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
            brand: '',
            images: [],
            sizes: [],
            tags: [],
            colors: [],
        },
    });

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control: form.control, name: "images" });
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control: form.control, name: "sizes" });
    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control: form.control, name: "tags" });
    const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control: form.control, name: "colors" });

    useEffect(() => {
        if (isEditMode) {
            try {
                const savedProducts = localStorage.getItem(PRODUCTS_KEY);
                const products: Product[] = savedProducts ? JSON.parse(savedProducts) : initialProducts;
                const productToEdit = products.find(p => p.id === id);

                if (productToEdit) {
                    form.reset({
                        name: productToEdit.name,
                        description: productToEdit.description,
                        price: productToEdit.price,
                        stock: productToEdit.stock,
                        category: productToEdit.category,
                        brand: productToEdit.brand,
                        images: productToEdit.images.map(val => ({ value: val })),
                        sizes: productToEdit.sizes.map(val => ({ value: val })),
                        tags: productToEdit.tags.map(val => ({ value: val })),
                        colors: productToEdit.colors.map(val => ({ name: val.name, hex: val.hex })),
                    });
                } else {
                    toast({ variant: 'destructive', title: 'Product not found' });
                    router.push('/admin/products');
                }
            } catch(e) {
                 toast({ variant: 'destructive', title: 'Failed to load product' });
            } finally {
                setIsFetching(false);
            }
        } else {
            form.reset({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                brand: '',
                images: [{value: ''}],
                sizes: [{value: 'M'}],
                tags: [],
                colors: [{name: 'Black', hex: '#000000'}],
            });
            setIsFetching(false);
        }
    }, [id, isEditMode, form, router, toast]);

    const onSubmit = (data: ProductFormValues) => {
        setIsLoading(true);

        const transformedData = {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category,
            brand: data.brand,
            images: data.images.map(i => i.value),
            sizes: data.sizes.map(s => s.value),
            tags: data.tags.map(t => t.value),
            colors: data.colors,
        };
        
        try {
            const savedProductsJSON = localStorage.getItem(PRODUCTS_KEY);
            let products: Product[] = [];
            if (savedProductsJSON) {
                try {
                    const parsed = JSON.parse(savedProductsJSON);
                    if (Array.isArray(parsed)) {
                        products = parsed;
                    }
                } catch (e) {
                    console.error("Could not parse products from localStorage, starting with a new list.", e);
                }
            }

            if (isEditMode) {
                const productIndex = products.findIndex(p => p.id === id);
                if (productIndex !== -1) {
                    products[productIndex] = { ...products[productIndex], ...transformedData };
                }
            } else {
                const newProduct: Product = {
                    ...transformedData,
                    id: `p${new Date().getTime()}`,
                    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                    reviewCount: Math.floor(Math.random() * 200) + 20,
                };
                products.push(newProduct);
            }

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
            toast({
                title: isEditMode ? 'Product Updated' : 'Product Created',
                description: `Product "${data.name}" has been successfully saved.`,
            });
            router.push('/admin/products');
        } catch (error) {
            toast({ variant: 'destructive', title: 'An error occurred', description: 'Could not save the product.' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isFetching) {
        return <p>Loading form...</p>;
    }

    const renderArrayField = (label: string, fields: any[], removeFn: Function, appendFn: Function, placeholder: string, fieldName: string) => (
      <div className="space-y-2">
          <Label>{label}</Label>
          {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                  <FormField
                      control={form.control}
                      name={`${fieldName}.${index}.value` as const}
                      render={({ field }) => (
                          <FormItem className="flex-grow">
                              <FormControl>
                                  <Input placeholder={placeholder} {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeFn(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => appendFn({ value: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add {label.slice(0, -1)}
          </Button>
      </div>
    );

    return (
        <div className="max-w-5xl mx-auto w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
                                <CardDescription>Fill in the details for the product.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea {...field} rows={5} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
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
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                         <Card>
                            <CardHeader><CardTitle>Attributes</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderArrayField("Images", imageFields, removeImage, appendImage, "https://example.com/image.png", "images")}
                                {renderArrayField("Sizes", sizeFields, removeSize, appendSize, "e.g., M", "sizes")}
                                {renderArrayField("Tags", tagFields, removeTag, appendTag, "e.g., new", "tags")}

                                <div className="space-y-2">
                                    <Label>Colors</Label>
                                    {colorFields.map((field, index) => (
                                        <div key={field.id} className="flex items-start gap-2">
                                            <FormField
                                                control={form.control}
                                                name={`colors.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-grow">
                                                        <FormControl><Input placeholder="Color Name" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`colors.${index}.hex`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-grow">
                                                        <FormControl><Input placeholder="#000000" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendColor({ name: '', hex: '' })}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Color
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading} size="lg">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Save Changes' : 'Create Product'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
