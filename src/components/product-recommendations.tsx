'use client';

import { useState, useEffect } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import { products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import * as AlertComponents from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

const PRODUCTS_KEY = 'appProducts';

interface ProductRecommendationsProps {
  viewingHistory: string[];
}

export function ProductRecommendations({ viewingHistory }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_KEY);
      if (savedProducts) {
        setAllProducts(JSON.parse(savedProducts));
      } else {
        setAllProducts(initialProducts);
      }
    } catch (e) {
      console.error("Failed to load products for recommendations", e);
      setAllProducts(initialProducts);
    }
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const result = await getProductRecommendations({
          viewingHistory,
          numberOfRecommendations: 6,
        });

        if (result.recommendedProducts) {
          const recommendedProds = result.recommendedProducts
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined);
          setRecommendations(recommendedProds);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    if (viewingHistory.length > 0) {
      fetchRecommendations();
    } else {
        setLoading(false);
    }
  }, [viewingHistory, allProducts]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
             <Skeleton className="h-[320px] w-full rounded-xl" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
     return (
        <AlertComponents.Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertComponents.AlertTitle>Error</AlertComponents.AlertTitle>
            <AlertComponents.AlertDescription>
                {error}
            </AlertComponents.AlertDescription>
        </AlertComponents.Alert>
     );
  }
  
  if (recommendations.length === 0) {
    return null; // Don't show anything if there are no recommendations
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {recommendations.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1 h-full">
                <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
}
