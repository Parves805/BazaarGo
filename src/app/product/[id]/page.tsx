'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductDetailsClient } from './product-details-client';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_KEY = 'appProducts';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_KEY);
      const allProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
      const foundProduct = allProducts.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error("Failed to load product", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && !product) {
        notFound();
    }
  }, [isLoading, product]);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="grid gap-4">
                    <Skeleton className="aspect-square w-full" />
                    <div className="grid grid-cols-5 gap-4">
                        <Skeleton className="aspect-square" />
                        <Skeleton className="aspect-square" />
                        <Skeleton className="aspect-square" />
                        <Skeleton className="aspect-square" />
                        <Skeleton className="aspect-square" />
                    </div>
                </div>
                 <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex items-center gap-4 mt-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 flex-grow" />
                        <Skeleton className="h-12 w-48" />
                    </div>
                 </div>
            </div>
        ) : product ? (
             <ProductDetailsClient product={product} />
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
