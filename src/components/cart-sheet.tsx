'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { products } from '@/lib/data';
import type { CartItem } from '@/lib/types';
import Image from 'next/image';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function CartSheet() {
  const { toast } = useToast();
  // Mock cart state with a couple of items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { ...products[0], quantity: 1 },
    { ...products[1], quantity: 2 },
  ]);

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
    })
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Your cart is empty",
        description: "Add items to your cart to proceed.",
      });
      return;
    }
    // This is a mock checkout. In a real app, you'd handle payment processing.
    setCartItems([]);
    toast({
      title: "Checkout Successful!",
      description: "Your order has been placed.",
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        data-ai-hint={`${item.category} product`}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity)) {
                                    handleUpdateQuantity(item.id, newQuantity);
                                }
                            }}
                            className="h-8 w-16" 
                            min="1" 
                        />
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-accent -mr-2"
                            onClick={() => handleRemoveItem(item.id)}
                         >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</span>
                </div>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="w-20 h-20 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
