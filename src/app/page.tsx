
'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { initialCategories, products as initialProducts } from '@/lib/data';
import type { Product, Category, PopupCampaign, WebsiteSettings, HomepageSection as HomepageSectionType, PromoCard as PromoCardType } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductRecommendations } from '@/components/product-recommendations';
import { PopupModal } from '@/components/popup-modal';
import { HomepageSection } from '@/components/homepage-section';
import { PromoGrid } from '@/components/promo-grid';

const SLIDER_IMAGES_KEY = 'heroSliderImages';
const PRODUCTS_KEY = 'appProducts';
const CATEGORIES_KEY = 'appCategories';
const VIEWING_HISTORY_KEY = 'bazaargoProductViewHistory';
const AI_SETTINGS_KEY = 'aiSettings';
const POPUP_CAMPAIGN_KEY = 'popupCampaignSettings';
const POPUP_SEEN_KEY = 'bazaargoPopupSeen';
const WEBSITE_SETTINGS_KEY = 'websiteSettings';
const HOMEPAGE_SECTIONS_KEY = 'homepageSections';
const PROMO_CARDS_KEY = 'promoCards';

const defaultSlides = [
    { url: 'https://img.lazcdn.com/us/domino/df7d0dca-dc55-4a5c-8cb2-dcf2b2a2f1cc_BD-1976-688.jpg_2200x2200q80.jpg_.webp', dataAiHint: 'electronics sale' },
    { url: 'https://placehold.co/1200x400.png', dataAiHint: 'mens fashion' },
    { url: 'https://placehold.co/1200x400.png', dataAiHint: 'winter collection' },
    { url: 'https://placehold.co/1200x400.png', dataAiHint: 't-shirt sale' },
    { url: 'https://placehold.co/1200x400.png', dataAiHint: 'polo shirts' },
    { url: 'https://placehold.co/1200x400.png', dataAiHint: 'new arrivals' },
];

interface Slide {
    url: string;
    dataAiHint: string;
}

const defaultHomepageSections: HomepageSectionType[] = [
  {
    id: 'default-polo-section',
    title: 'Designer Polo',
    mainImageUrl: 'https://lzd-img-global.slatic.net/g/p/mdc/89839425a81a7114b341496a75f10255.jpg_720x720q80.jpg',
    categorySlug: 'polo-tshirt',
  }
];

const defaultPromoCards: PromoCardType[] = [
    { id: '1', title: 'Classic Polo', imageUrl: 'https://fabrilife.com/products/650182af39a77-square.jpeg', link: '/category/polo-tshirt' },
    { id: '2', title: 'Designer Polo', imageUrl: 'https://img.drz.lazcdn.com/g/p/mdc/d08e501aee3431a41857876ab4646a5a.jpg_720x720q80.jpg', link: '/category/polo-tshirt' },
    { id: '3', title: 'Kids Polo', imageUrl: 'https://placehold.co/400x500.png', link: '/category/polo-tshirt' },
];

export default function Home() {
  const [heroSlides, setHeroSlides] = React.useState<Slide[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [viewingHistory, setViewingHistory] = React.useState<string[]>([]);
  const [aiSettings, setAiSettings] = React.useState({ recommendationsEnabled: true });
  const [popupCampaign, setPopupCampaign] = React.useState<PopupCampaign | null>(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [homepageSections, setHomepageSections] = React.useState<HomepageSectionType[]>([]);
  const [promoCards, setPromoCards] = React.useState<PromoCardType[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = () => {
      try {
        // Load hero slides
        const savedImages = localStorage.getItem(SLIDER_IMAGES_KEY);
        setHeroSlides(prev => {
            const parsed = savedImages ? JSON.parse(savedImages) : defaultSlides;
            if (Array.isArray(parsed) && parsed.length > 0) {
                const newSlides = parsed.filter((slide: Slide) => slide.url);
                return JSON.stringify(prev) !== JSON.stringify(newSlides) ? newSlides : prev;
            } else if (!savedImages) {
                 return defaultSlides;
            }
            return prev;
        });
        
        // Load products
        const savedProductsJSON = localStorage.getItem(PRODUCTS_KEY);
        setProducts(prev => {
            const allProducts = savedProductsJSON ? JSON.parse(savedProductsJSON) : initialProducts;
            return JSON.stringify(prev) !== JSON.stringify(allProducts) ? allProducts : prev;
        });
        
        // Load categories
        const savedCategoriesJSON = localStorage.getItem(CATEGORIES_KEY);
        setCategories(prev => {
            const newCategories = savedCategoriesJSON ? JSON.parse(savedCategoriesJSON) : initialCategories;
            return JSON.stringify(prev) !== JSON.stringify(newCategories) ? newCategories : prev;
        });

        // Load viewing history
        const historyJson = localStorage.getItem(VIEWING_HISTORY_KEY);
        setViewingHistory(prev => {
            const newHistory = historyJson ? JSON.parse(historyJson) : [];
            return JSON.stringify(prev) !== JSON.stringify(newHistory) ? newHistory : prev;
        });

        // Load AI settings
        const savedAiSettings = localStorage.getItem(AI_SETTINGS_KEY);
        setAiSettings(prev => {
            const newSettings = savedAiSettings ? JSON.parse(savedAiSettings) : { recommendationsEnabled: true };
            return JSON.stringify(prev) !== JSON.stringify(newSettings) ? newSettings : prev;
        });

        // Load Popup Campaign
        const savedPopupCampaign = localStorage.getItem(POPUP_CAMPAIGN_KEY);
        if (savedPopupCampaign) {
          const campaign = JSON.parse(savedPopupCampaign);
          setPopupCampaign(campaign);

          const popupSeen = localStorage.getItem(POPUP_SEEN_KEY);
          if (!popupSeen && campaign.enabled) {
              setShowPopup(true);
          }
        }
        
        // Load Homepage Sections
        const savedHomepageSections = localStorage.getItem(HOMEPAGE_SECTIONS_KEY);
        setHomepageSections(savedHomepageSections ? JSON.parse(savedHomepageSections) : defaultHomepageSections);

        // Load Promo Cards
        const savedPromoCards = localStorage.getItem(PROMO_CARDS_KEY);
        setPromoCards(savedPromoCards ? JSON.parse(savedPromoCards) : defaultPromoCards);

      } catch (error) {
        console.error("Failed to load data from localStorage, using defaults.", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsLoading(true);
    loadData();
    const interval = setInterval(loadData, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePopupClose = () => {
      setShowPopup(false);
      localStorage.setItem(POPUP_SEEN_KEY, 'true');
  };

  const featuredProducts = products.slice(0, 8);
  const saleProducts = products.filter((p: Product) => p.tags.includes('sale'));

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pb-16 md:pb-0">
         {popupCampaign && showPopup && (
            <PopupModal
                campaign={popupCampaign}
                onClose={handlePopupClose}
            />
        )}
        {/* Hero Section */}
        <section>
          {isLoading ? (
            <Skeleton className="w-full h-[135.25px] md:h-[70vh] rounded-lg" />
          ) : (
            <div className="overflow-hidden rounded-lg">
                <Carousel
                plugins={[plugin.current]}
                opts={{ loop: true, align: 'start' }}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                >
                <CarouselContent>
                    {heroSlides.filter(slide => slide.url).map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full h-[135.25px] md:h-[70vh]">
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
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="py-8 md:py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-center font-headline mb-6">Shop by Category</h2>
             <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {isLoading ? [...Array(8)].map((_, i) => (
                  <CarouselItem key={i} className="basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
                    <div className="p-1 space-y-2">
                       <Skeleton className="aspect-square rounded-lg" />
                       <Skeleton className="h-4 w-10/12 mx-auto" />
                    </div>
                  </CarouselItem>
                )) : categories.map((category) => (
                  <CarouselItem key={category.id} className="basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
                    <div className="p-1">
                      <Link href={`/category/${category.id}`} className="group text-center block">
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
                        <h3 className="mt-2 font-semibold text-xs leading-tight group-hover:text-primary">{category.name}</h3>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>
        
        {/* Promo Grid Section */}
        <PromoGrid promoCards={promoCards} isLoading={isLoading} />

        {/* Featured Products Section */}
        <section className="bg-secondary/50 py-12 md:py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">Featured Products</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {isLoading ? [...Array(6)].map((_, i) => (
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

        {/* Dynamic Homepage Sections */}
        {homepageSections.map((section, index) => (
          <HomepageSection 
            key={section.id} 
            section={section} 
            products={products}
            isFirst={index === 0} 
            isLoading={isLoading}
          />
        ))}

        {/* On Sale Now Section */}
        {saleProducts.length > 0 && (
          <section className="py-12 md:py-20">
            <div className="container">
              <h2 className="text-3xl font-bold text-center font-headline mb-8">On Sale Now</h2>
              <Carousel opts={{ align: "start", loop: saleProducts.length > 4 }} className="w-full">
                <CarouselContent>
                  {isLoading ? [...Array(4)].map((_, i) => (
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
