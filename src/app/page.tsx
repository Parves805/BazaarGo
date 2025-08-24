
'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import type { Product, Category, PopupCampaign, WebsiteSettings, HomepageSection as HomepageSectionType, PromoSection } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductRecommendations } from '@/components/product-recommendations';
import { PopupModal } from '@/components/popup-modal';
import { HomepageSection } from '@/components/homepage-section';
import { PromoGrid } from '@/components/promo-grid';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';
import { productsCollection, categoriesCollection, websiteSettingsDoc, aiSettingsDoc, popupCampaignDoc, homepageSectionsDoc, promoSectionsDoc } from '@/lib/firebase';
import { getDoc } from 'firebase/firestore';

const VIEWING_HISTORY_KEY = 'bazaargoProductViewHistory';
const SLIDER_IMAGES_KEY = 'heroSliderImages'; // Still using localStorage for this for now as it's less critical
const POPUP_SEEN_SESSION_KEY = 'bazaargoPopupSeenSession';


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

export default function Home() {
  const [heroSlides, setHeroSlides] = React.useState<Slide[]>([]);
  const { data: products, isLoading: productsLoading } = useFirestoreQuery<Product>(productsCollection);
  const { data: categories, isLoading: categoriesLoading } = useFirestoreQuery<Category>(categoriesCollection);
  
  const [viewingHistory, setViewingHistory] = React.useState<string[]>([]);
  const [aiSettings, setAiSettings] = React.useState({ recommendationsEnabled: true });
  const [popupCampaign, setPopupCampaign] = React.useState<PopupCampaign | null>(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [homepageSections, setHomepageSections] = React.useState<HomepageSectionType[]>([]);
  const [promoSections, setPromoSections] = React.useState<PromoSection[]>([]);
  const [settingsLoading, setSettingsLoading] = React.useState(true);


  const isLoading = productsLoading || categoriesLoading || settingsLoading;

  React.useEffect(() => {
    // Load non-critical or session data from localStorage
    const historyJson = localStorage.getItem(VIEWING_HISTORY_KEY);
    setViewingHistory(historyJson ? JSON.parse(historyJson) : []);

    const savedImages = localStorage.getItem(SLIDER_IMAGES_KEY);
    setHeroSlides(savedImages ? JSON.parse(savedImages) : defaultSlides);

    // Fetch settings from Firestore
    const fetchSettings = async () => {
        try {
            const [
                aiSettingsSnap, 
                popupCampaignSnap, 
                homepageSectionsSnap,
                promoSectionsSnap
            ] = await Promise.all([
                getDoc(aiSettingsDoc),
                getDoc(popupCampaignDoc),
                getDoc(homepageSectionsDoc),
                getDoc(promoSectionsDoc)
            ]);

            if (aiSettingsSnap.exists()) {
                setAiSettings(aiSettingsSnap.data());
            }

            if (popupCampaignSnap.exists()) {
                const campaign = popupCampaignSnap.data();
                setPopupCampaign(campaign);
                const popupSeen = sessionStorage.getItem(POPUP_SEEN_SESSION_KEY);
                if (campaign.enabled && !popupSeen) {
                    setShowPopup(true);
                    sessionStorage.setItem(POPUP_SEEN_SESSION_KEY, 'true');
                }
            }

            if (homepageSectionsSnap.exists()) {
                 setHomepageSections(homepageSectionsSnap.data().sections);
            }
             if (promoSectionsSnap.exists()) {
                 setPromoSections(promoSectionsSnap.data().sections);
            }

        } catch (error) {
            console.error("Failed to load settings from Firestore:", error);
        } finally {
            setSettingsLoading(false);
        }
    };

    fetchSettings();

  }, []);

  const handlePopupClose = () => {
      setShowPopup(false);
  };

  const featuredProducts = products.slice(0, 8);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8);
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
        
        {/* Recent Products Section */}
        {recentProducts.length > 0 && (
          <section className="bg-secondary/50 py-12 md:py-20">
            <div className="container">
              <h2 className="text-3xl font-bold text-center font-headline mb-8">Recent Products</h2>
              <Carousel opts={{ align: "start", loop: recentProducts.length > 4 }} className="w-full">
                <CarouselContent>
                  {isLoading ? [...Array(4)].map((_, i) => (
                    <CarouselItem key={i} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1"><Skeleton className="h-[400px]" /></div>
                    </CarouselItem>
                  )) : recentProducts.map((product) => (
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

        {/* Featured Products Section */}
        <section className="py-12 md:py-20">
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
          <section className="bg-secondary/50 py-12 md:py-20">
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

        {/* Promo Grid Sections */}
        {promoSections.map((section) => (
            <PromoGrid key={section.id} promoCards={section.cards} isLoading={isLoading} />
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
