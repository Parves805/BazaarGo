
'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { categories, products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductRecommendations } from '@/components/product-recommendations';

const SLIDER_IMAGES_KEY = 'heroSliderImages';
const PRODUCTS_KEY = 'appProducts';
const VIEWING_HISTORY_KEY = 'bazaargoProductViewHistory';
const AI_SETTINGS_KEY = 'aiSettings';

const defaultSlides = [
    { url: 'https://img.lazcdn.com/us/domino/df7d0dca-dc55-4a5c-8cb2-dcf2b2a2f1cc_BD-1976-688.jpg_2200x2200q80.jpg_.webp', dataAiHint: 'electronics sale' },
    { url: 'https://placehold.co/1200x800.png', dataAiHint: 'mens fashion' },
    { url: 'https://placehold.co/1200x800.png', dataAiHint: 'winter collection' },
    { url: 'https://placehold.co/1200x800.png', dataAiHint: 't-shirt sale' },
    { url: 'https://placehold.co/1200x800.png', dataAiHint: 'polo shirts' },
    { url: 'https://placehold.co/1200x800.png', dataAiHint: 'new arrivals' },
];

interface Slide {
    url: string;
    dataAiHint: string;
}

export default function Home() {
  const [heroSlides, setHeroSlides] = React.useState<Slide[]>([]);
  const [isLoadingSlides, setIsLoadingSlides] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [saleProducts, setSaleProducts] = React.useState<Product[]>([]);
  const [viewingHistory, setViewingHistory] = React.useState<string[]>([]);
  const [aiSettings, setAiSettings] = React.useState({ recommendationsEnabled: true });

  React.useEffect(() => {
    setIsLoadingSlides(true);
    setIsLoadingProducts(true);

    try {
      // Load hero slides
      const savedImages = localStorage.getItem(SLIDER_IMAGES_KEY);
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          setHeroSlides(parsedImages.filter(slide => slide.url));
        } else {
          setHeroSlides(defaultSlides);
        }
      } else {
        setHeroSlides(defaultSlides);
      }

      // Load products
      const savedProductsJSON = localStorage.getItem(PRODUCTS_KEY);
      let allProducts: Product[] = initialProducts;
      if (savedProductsJSON) {
        const parsed = JSON.parse(savedProductsJSON);
        if (Array.isArray(parsed)) {
          allProducts = parsed;
        }
      }
      setProducts(allProducts);
      const onSale = allProducts.filter((p: Product) => p.tags.includes('sale'));
      setSaleProducts(onSale);

      // Load viewing history
      const historyJson = localStorage.getItem(VIEWING_HISTORY_KEY);
      if (historyJson) {
        setViewingHistory(JSON.parse(historyJson));
      }

      // Load AI settings
      const savedAiSettings = localStorage.getItem(AI_SETTINGS_KEY);
      if (savedAiSettings) {
        setAiSettings(JSON.parse(savedAiSettings));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage, using defaults.", error);
      // Fallback to defaults on any error
      setHeroSlides(defaultSlides);
      setProducts(initialProducts);
      setSaleProducts(initialProducts.filter((p: Product) => p.tags.includes('sale')));
      setViewingHistory([]);
      setAiSettings({ recommendationsEnabled: true });
    } finally {
      setIsLoadingSlides(false);
      setIsLoadingProducts(false);
    }
  }, []);


  const featuredProducts = products.slice(0, 8);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pb-16 md:pb-0">
        {/* Hero Section */}
        <section>
          {isLoadingSlides ? (
            <Skeleton className="h-[60vh] md:h-[70vh] w-full" />
          ) : (
            <Carousel
              plugins={[plugin.current]}
              opts={{ loop: true }}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {heroSlides.filter(slide => slide.url).map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[60vh] md:h-[70vh] w-full">
                      <Image
                        src={slide.url}
                        alt={`Hero slide ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={slide.dataAiHint}
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
            </Carousel>
          )}
        </section>

        {/* Categories Section */}
        <section className="py-8 md:py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-center font-headline mb-6">Shop by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {categories.map((category) => (
                <Link href={`/category/${category.id}`} key={category.id} className="group text-center w-36 flex-shrink-0">
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={`mens ${category.name}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <h3 className="mt-2 font-semibold text-sm group-hover:text-primary">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-secondary/50 py-12 md:py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">Featured Products</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {isLoadingProducts ? [...Array(6)].map((_, i) => (
                  <CarouselItem key={i} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1"><Skeleton className="h-[400px]" /></div>
                  </CarouselItem>
                )) : featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </div>
        </section>

        {/* On Sale Now Section */}
        {saleProducts.length > 0 && (
          <section className="py-12 md:py-20">
            <div className="container">
              <h2 className="text-3xl font-bold text-center font-headline mb-8">On Sale Now</h2>
              <Carousel opts={{ align: "start", loop: saleProducts.length > 4 }} className="w-full">
                <CarouselContent>
                  {isLoadingProducts ? [...Array(4)].map((_, i) => (
                    <CarouselItem key={i} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1"><Skeleton className="h-[400px]" /></div>
                    </CarouselItem>
                  )) : saleProducts.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
            </div>
          </section>
        )}

        {/* Just For You Section */}
        {aiSettings.recommendationsEnabled && viewingHistory.length > 0 && (
          <section className="bg-secondary/50 py-12 md:py-20">
            <div className="container">
              <h2 className="text-3xl font-bold text-center font-headline mb-8">Just For You</h2>
              <ProductRecommendations viewingHistory={viewingHistory} />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
