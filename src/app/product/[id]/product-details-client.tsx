
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/context/wishlist-context';
import type { Product } from '@/lib/types';
import { Star, StarHalf, Heart, Check, Minus, Plus, MessageSquare, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FormItem } from '@/components/ui/form';
import { useChat } from '@/context/chat-context';

const VIEWING_HISTORY_KEY = 'bazaargoProductViewHistory';
const MAX_HISTORY_LENGTH = 10;

function Rating({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full_${i}`} className="w-5 h-5 fill-primary text-primary" />)}
        {halfStar && <StarHalf className="w-5 h-5 fill-primary text-primary" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty_${i}`} className="w-5 h-5 text-muted-foreground/50" />)}
      </div>
      <span className="text-muted-foreground text-sm">({reviewCount} reviews)</span>
    </div>
  );
}

export function ProductDetailsClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setChatOpen } = useChat();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>();

  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    try {
        const historyJson = localStorage.getItem(VIEWING_HISTORY_KEY);
        let history: string[] = historyJson ? JSON.parse(historyJson) : [];

        // Remove the current product's ID if it exists, to move it to the front
        history = history.filter(id => id !== product.id);

        // Add the current product's ID to the beginning of the array
        history.unshift(product.id);

        // Trim the history to the maximum length
        if (history.length > MAX_HISTORY_LENGTH) {
            history = history.slice(0, MAX_HISTORY_LENGTH);
        }

        localStorage.setItem(VIEWING_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to update viewing history:', error);
    }
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: 'Please select a color',
        variant: 'destructive',
      });
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
  };
  
  const handleBuyNow = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: 'Please select a color',
        variant: 'destructive',
      });
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    router.push('/checkout');
  };

  const handleMessageSeller = () => {
    setChatOpen(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="grid gap-4">
        <div className="relative aspect-square rounded-lg overflow-hidden border">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
            data-ai-hint={`${product.category} product`}
          />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {product.images.map((img, index) => (
            <button
              key={index}
              className={cn(
                'relative aspect-square rounded-md overflow-hidden border-2 transition',
                activeImage === img ? 'border-primary' : 'border-transparent'
              )}
              onClick={() => setActiveImage(img)}
            >
              <Image
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                data-ai-hint={`${product.category} product`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-4">
        <div>
            <p className="text-sm font-medium text-primary uppercase">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mt-1">{product.name}</h1>
        </div>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="text-3xl font-bold text-primary">
            ৳{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <Separator />
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        
        <div className="space-y-4">
            {/* Size Selector */}
            <div className="space-y-2">
                <Label className="text-base font-semibold">Size</Label>
                <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    className="flex flex-wrap gap-2"
                >
                    {product.sizes.map((size) => (
                    <FormItem key={size} className="flex items-center space-x-0 space-y-0">
                        <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                        <Label
                        htmlFor={`size-${size}`}
                        className={cn(
                            "flex h-10 w-12 cursor-pointer items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            selectedSize === size && "border-primary ring-2 ring-primary"
                        )}
                        >
                        {size}
                        </Label>
                    </FormItem>
                    ))}
                </RadioGroup>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
                <Label className="text-base font-semibold">Color: <span className="font-normal text-muted-foreground">{selectedColor?.name}</span></Label>
                <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                    <button
                        key={color.name}
                        type="button"
                        className={cn(
                        "h-8 w-8 rounded-full border-2 transition",
                        selectedColor?.name === color.name ? "border-primary ring-2 ring-primary" : "border-muted-foreground/50"
                        )}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color.name}`}
                    />
                    ))}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <span className="font-semibold">Availability:</span>
            {product.stock > 0 ? (
                <span className="text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> In Stock</span>
            ) : (
                <span className="text-red-600">Out of Stock</span>
            )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-4">
            <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
                    Add to Cart
                </Button>
                <Button size="lg" className="w-full" onClick={handleBuyNow} disabled={product.stock === 0}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now
                </Button>
            </div>
          <Button size="lg" variant="outline" className="p-3" onClick={() => toggleWishlist(product)} aria-label="Toggle Wishlist">
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-current text-accent")} />
          </Button>
          <Button size="lg" variant="outline" className="p-3" onClick={handleMessageSeller} aria-label="Message Seller">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
