
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';
import { productsCollection } from '@/lib/firebase';

export default function ShopPage() {
  const { data: products, isLoading } = useFirestoreQuery<Product>(productsCollection);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container pt-8 pb-24 md:pt-12 md:pb-12">
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
