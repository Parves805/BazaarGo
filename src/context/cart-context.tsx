'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, quantity: number, selectedSize?: string, selectedColor?: { name: string; hex: string }) => void;
  removeItem: (productId: string, selectedSize?: string, selectedColorName?: string) => void;
  updateQuantity: (productId: string, selectedSize?: string, selectedColorName?: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cartState';

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addItem = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: { name: string; hex: string }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor?.name === selectedColor?.name
      );

      if (existingItem) {
        // Update quantity if item with same variant already exists
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === selectedSize && item.selectedColor?.name === selectedColor?.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart with selected variants
        const newItem: CartItem = { 
            ...product, 
            quantity, 
            selectedSize, 
            selectedColor 
        };
        return [...prevItems, newItem];
      }
    });
    toast({
        title: "Item added to cart",
        description: `${product.name}${selectedSize || selectedColor ? ` (${[selectedColor?.name, selectedSize].filter(Boolean).join(' / ')})` : ''} has been added to your cart.`,
    });
  };

  const removeItem = (productId: string, selectedSize?: string, selectedColorName?: string) => {
    setCartItems(prevItems => prevItems.filter(item => 
        !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor?.name === selectedColorName)
    ));
    toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, selectedSize?: string, selectedColorName?: string, quantity: number) => {
     if (quantity < 1) {
      removeItem(productId, selectedSize, selectedColorName);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.selectedSize === selectedSize && item.selectedColor?.name === selectedColorName 
        ? { ...item, quantity } 
        : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
