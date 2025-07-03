import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { categories, products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { ProductRecommendations } from '@/components/product-recommendations';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.slice(0, 6);
  // Mock viewing history for the AI recommendations
  const viewingHistory = ['p2', 'p4', 'p6'];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] w-full bg-gradient-to-r from-primary/20 to-secondary/20">
          <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Promotional banner"
            fill
            className="object-cover -z-10"
            data-ai-hint="mens fashion"
            priority
          />
          <div className="container h-full flex flex-col items-start justify-center text-left">
            <div className="max-w-2xl bg-background/80 backdrop-blur-sm p-8 rounded-lg">
                <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
                Unbeatable Deals, Endless Choices.
                </h1>
                <p className="mt-4 text-lg md:text-xl text-foreground/80">
                Discover your next favorite thing at BazaarGo. Quality products at prices you'll love.
                </p>
                <Button size="lg" className="mt-6">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 md:py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-center font-headline mb-6">Shop by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {categories.map((category) => (
                <a href="#" key={category.id} className="group text-center w-36 flex-shrink-0">
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
                </a>
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
                {featuredProducts.map((product) => (
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

        {/* AI Recommendations Section */}
        <section className="py-12 md:py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">You Might Also Like</h2>
            <ProductRecommendations viewingHistory={viewingHistory} />
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
