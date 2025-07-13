
'use client';

import type { HomepageSection as HomepageSectionType, Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

interface HomepageSectionProps {
  section: HomepageSectionType;
  products: Product[];
  isFirst?: boolean;
  isLoading: boolean;
}

export function HomepageSection({ section, products, isFirst = false, isLoading }: HomepageSectionProps) {
  const sectionProducts = products.filter(p => p.category === section.categorySlug).slice(0, 7);

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 row-span-2">
              <Skeleton className="w-full h-full aspect-square md:aspect-auto" />
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Main Image */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-lg">
            <Link href={`/category/${section.categorySlug}`}>
              <Image
                src={section.mainImageUrl}
                alt={section.title}
                width={500}
                height={500}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={`featured ${section.title}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white font-headline">{section.title}</h3>
              </div>
            </Link>
          </div>

          {/* Product Grid */}
          {sectionProducts.map(product => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg">
              <Link href={`/product/${product.id}`}>
                 <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full aspect-square transition-transform duration-300 group-hover:scale-105"
                  />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                   <p className="text-xs">৳{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </div>
          ))}
          
          {/* View More */}
          <Link href={`/category/${section.categorySlug}`} className="group relative overflow-hidden rounded-lg">
             <div className="aspect-square w-full bg-secondary flex items-center justify-center">
               <Image
                  src={sectionProducts.length > 0 ? sectionProducts[0].images[0] : 'https://placehold.co/300x300.png'}
                  alt={`View More ${section.title}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full aspect-square transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <h4 className="text-white text-xl font-bold font-headline">VIEW MORE</h4>
                </div>
             </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
