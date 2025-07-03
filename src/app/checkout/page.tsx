
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CreditCard, Truck, Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Invalid phone number' }),
  street: z.string().min(3, { message: 'Street address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zip: z.string().min(4, { message: 'Zip code is required' }),
  paymentMethod: z.enum(['cash', 'bkash', 'nagad', 'rocket'], {
    required_error: "You need to select a payment method.",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const shippingCost = 5.00;

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart, totalItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      paymentMethod: 'cash',
    },
  });

  useEffect(() => {
    // Redirect to home if cart is empty
    if (totalItems === 0 && !isProcessing) {
      router.replace('/');
    }

    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const { savedUser } = JSON.parse(savedProfile);
        if (savedUser) {
           form.reset({
            name: savedUser.name || '',
            email: savedUser.email || '',
            phone: savedUser.phone || '',
            street: savedUser.address?.street || '',
            city: savedUser.address?.city || '',
            state: savedUser.address?.state || '',
            zip: savedUser.address?.zip || '',
            paymentMethod: form.getValues('paymentMethod'),
          });
        }
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
    }
  }, [totalItems, router, isProcessing, form]);


  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const order = {
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
      items: cartItems,
      total: subtotal + shippingCost,
      shippingInfo: data,
      status: 'Processing' as const,
    };

    try {
        const existingOrders = JSON.parse(localStorage.getItem('bazaargoUserOrders') || '[]');
        localStorage.setItem('bazaargoUserOrders', JSON.stringify([order, ...existingOrders]));
    } catch (error) {
        console.error("Failed to save order to localStorage", error);
    }

    clearCart();
    toast({
      title: 'Order Placed Successfully!',
      description: 'Thank you for your purchase. We will notify you once your order has shipped.',
    });

    router.push('/orders');
  };
  
  if (totalItems === 0 && !isProcessing) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow flex items-center justify-center">
                <p>Your cart is empty. Redirecting...</p>
            </main>
            <SiteFooter />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow container py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div>
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                         <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                    <div>
                         <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                            >
                                <FormItem>
                                    <Label className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="cash" />
                                        </FormControl>
                                        <Truck className="h-6 w-6" />
                                        <div>
                                            <span className="font-semibold">Cash on Delivery</span>
                                            <p className="text-sm text-muted-foreground">Pay with cash upon receiving your order.</p>
                                        </div>
                                    </Label>
                                </FormItem>
                                <FormItem>
                                    <Label className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="bkash" />
                                        </FormControl>
                                        <CreditCard className="h-6 w-6" />
                                        <div>
                                            <span className="font-semibold">bKash</span>
                                            <p className="text-sm text-muted-foreground">Pay via bKash mobile banking.</p>
                                        </div>
                                    </Label>
                                </FormItem>
                                <FormItem>
                                    <Label className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="nagad" />
                                        </FormControl>
                                        <CreditCard className="h-6 w-6" />
                                        <div>
                                            <span className="font-semibold">Nagad</span>
                                            <p className="text-sm text-muted-foreground">Pay via Nagad mobile banking.</p>
                                        </div>
                                    </Label>
                                </FormItem>
                                <FormItem>
                                    <Label className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                        <FormControl>
                                            <RadioGroupItem value="rocket" />
                                        </FormControl>
                                        <CreditCard className="h-6 w-6" />
                                        <div>
                                            <span className="font-semibold">Rocket</span>
                                            <p className="text-sm text-muted-foreground">Pay via Rocket mobile banking.</p>
                                        </div>
                                    </Label>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor.name}`} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.selectedSize} / {item.selectedColor.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', currencyDisplay: 'symbol' }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', currencyDisplay: 'symbol' }).format(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', currencyDisplay: 'symbol' }).format(shippingCost)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', currencyDisplay: 'symbol' }).format(subtotal + shippingCost)}</span>
                      </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                          <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                          </>
                      ) : (
                          <>
                              Place Order ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT', currencyDisplay: 'symbol' }).format(subtotal + shippingCost)})
                          </>
                      )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <SiteFooter />
    </div>
  );
}
