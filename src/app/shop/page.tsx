import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline">Shop</h1>
            <p className="text-muted-foreground mt-2">Browse our full collection of high-quality men's apparel.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
