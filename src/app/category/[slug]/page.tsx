'use client';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { initialCategories, products as initialProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_KEY = 'appProducts';
const CATEGORIES_KEY = 'appCategories';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = categories.find((c) => c.id === slug);
  const filteredProducts = products.filter((p) => p.category === slug);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Load products
      const savedProductsJSON = localStorage.getItem(PRODUCTS_KEY);
      if (savedProductsJSON) {
        const parsed = JSON.parse(savedProductsJSON);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        } else {
          setProducts(initialProducts);
        }
      } else {
        setProducts(initialProducts);
      }

      // Load categories
      const savedCategoriesJSON = localStorage.getItem(CATEGORIES_KEY);
      if (savedCategoriesJSON) {
        const parsed = JSON.parse(savedCategoriesJSON);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        } else {
          setCategories(initialCategories);
        }
      } else {
        setCategories(initialCategories);
      }

    } catch (error) {
      console.error("Failed to load data from localStorage, using defaults.", error);
      setProducts(initialProducts);
      setCategories(initialCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !category) {
      notFound();
    }
  }, [isLoading, category]);


  if (isLoading || !category) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow pb-16 md:pb-0">
                <Skeleton className="h-56 w-full" />
                <div className="container py-8 md:py-12">
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[320px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pb-16 md:pb-0">
        <section className="relative h-56 w-full">
            <Image
                src={category.bannerImage}
                alt={`${category.name} banner`}
                fill
                className="object-cover"
                data-ai-hint={`mens ${category.id.replace('-', ' ')}`}
                priority
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl font-bold font-headline">{category.name}</h1>
                    <p className="text-md md:text-lg mt-2">Explore our collection of {category.name.toLowerCase()}.</p>
                </div>
            </div>
        </section>

        <div className="container py-8 md:py-12">
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span>{category.name}</span>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">No products found in this category yet.</p>
                </div>
            )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}