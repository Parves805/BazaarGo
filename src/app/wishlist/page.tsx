'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { useWishlist } from '@/context/wishlist-context';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-headline">My Wishlist</h1>
          <p className="text-muted-foreground mt-2">Your favorite items, all in one place.</p>
        </div>
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-semibold">Your wishlist is empty.</h2>
            <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your wishlist yet.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
