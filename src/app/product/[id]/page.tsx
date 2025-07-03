import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductDetailsClient } from './product-details-client';


interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);
  return {
    title: product ? `${product.name} | BazaarGo` : 'Product | BazaarGo',
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <ProductDetailsClient product={product} />
      </main>
      <SiteFooter />
    </div>
  );
}

// Generate static paths for all products
export async function generateStaticParams() {
    return products.map((product) => ({
      id: product.id,
    }));
}
