'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductDetailsClient } from './product-details-client';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/product-card';

const PRODUCTS_KEY = 'appProducts';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    try {
      const savedProductsJSON = localStorage.getItem(PRODUCTS_KEY);
      let products: Product[] = initialProducts;
      if (savedProductsJSON) {
          const parsed = JSON.parse(savedProductsJSON);
          if (Array.isArray(parsed)) {
              products = parsed;
          }
      }
      setAllProducts(products);
      const foundProduct = products.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error("Failed to load product from localStorage, trying fallback", error);
      const foundProduct = initialProducts.find((p: Product) => p.id === id);
      if(foundProduct) setProduct(foundProduct);
      setAllProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && !product) {
        notFound();
    }
  }, [isLoading, product]);

  const relatedProducts = product 
    ? allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container pt-8 pb-24 md:pt-12 md:pb-12">
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

        {!isLoading && relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
