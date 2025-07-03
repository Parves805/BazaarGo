'use client';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { products as initialProducts } from '@/lib/data';

const PRODUCTS_KEY = 'appProducts';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_KEY);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline">Shop</h1>
            <p className="text-muted-foreground mt-2">Browse our full collection of high-quality men's apparel.</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                 <Skeleton className="h-[320px] w-full rounded-xl" />
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
