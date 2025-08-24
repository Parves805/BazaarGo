
'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductDetailsClient } from './product-details-client';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/product-card';
import { doc, getDoc, query, where, limit } from 'firebase/firestore';
import { db, productsCollection } from '@/lib/firebase';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';


export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch related products
  const relatedProductsQuery = product ? query(
      productsCollection, 
      where("category", "==", product.category), 
      where("id", "!=", product.id), 
      limit(4)
  ) : null;
  const { data: relatedProducts, isLoading: relatedLoading } = useFirestoreQuery<Product>(relatedProductsQuery, [product?.category]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    
    const fetchProduct = async () => {
        try {
            const productDocRef = doc(db, "products", id);
            const productSnap = await getDoc(productDocRef);
            if (productSnap.exists()) {
                setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
            } else {
                setProduct(null);
            }
        } catch (error) {
            console.error("Failed to load product from Firestore", error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchProduct();

  }, [id]);

  useEffect(() => {
    if (!isLoading && !product) {
        notFound();
    }
  }, [isLoading, product]);

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

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLoading ? (
                  [...Array(4)].map((_,i) => <Skeleton key={i} className="h-96" />)
              ) : (
                relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
