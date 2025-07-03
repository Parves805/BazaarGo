import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { products, categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categories.find((c) => c.id === params.slug);
  return {
    title: category ? `${category.name} | BazaarGo` : 'Category | BazaarGo',
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  const category = categories.find((c) => c.id === slug);
  const filteredProducts = products.filter((p) => p.category === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        <section className="relative h-64 md:h-80 w-full">
            <Image
                src={category.bannerImage}
                alt={`${category.name} banner`}
                fill
                className="object-cover"
                data-ai-hint={`mens ${category.id.replace('-', ' ')}`}
                priority
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">{category.name}</h1>
                    <p className="text-lg md:text-xl mt-2">Explore our collection of {category.name.toLowerCase()}.</p>
                </div>
            </div>
        </section>

        <div className="container py-8 md:py-12">
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">No products found in this category yet.</p>
                </div>
            )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
    return categories.map((category) => ({
      slug: category.id,
    }));
}
