import Image from 'next/image';
import Link from 'next/link';
import { Star, StarHalf } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

function Rating({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full_${i}`} className="w-4 h-4 fill-primary text-primary" />)}
        {halfStar && <StarHalf className="w-4 h-4 fill-primary text-primary" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty_${i}`} className="w-4 h-4 text-muted-foreground/50" />)}
      </div>
      <span>({reviewCount})</span>
    </div>
  );
}


export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col bg-card">
      <CardHeader className="p-0 border-b">
        <div className="relative aspect-square w-full">
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={`${product.category} product`}
            />
          </Link>
           { product.tags.includes('new') && <Badge variant="default" className="absolute top-3 left-3 bg-primary">NEW</Badge> }
           { product.stock < 20 && <Badge variant="destructive" className="absolute top-3 right-3">LOW STOCK</Badge> }
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
          <CardTitle className="text-lg leading-tight font-headline mt-1">
              <Link href={`/product/${product.id}`} className="hover:text-primary">{product.name}</Link>
          </CardTitle>
        </div>
        <div className="flex items-end justify-between mt-2">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
             <div className="text-primary font-bold text-xl">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
