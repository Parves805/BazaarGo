'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wishlistState';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
        console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      // Remove item
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== product.id));
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      // Add item
      setWishlistItems(prevItems => [...prevItems, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };
  
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
