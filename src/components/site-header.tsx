
'use client';

import { Search, User, Heart, ShoppingBag, Menu, LogIn, UserPlus, UserCircle, Settings, LogOut, ListOrdered, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';

export function SiteHeader() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { wishlistCount } = useWishlist();
  const { totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Side: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="py-6 px-4">
                      <Link href="/" className="mb-6 flex items-center space-x-2">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                          <span className="font-bold font-headline">BazaarGo</span>
                      </Link>
                      <nav className="flex flex-col space-y-3">
                          <Link href="/" className="text-lg font-medium text-foreground/80 hover:text-primary">Home</Link>
                          <Link href="/shop" className="text-lg font-medium text-foreground/80 hover:text-primary">Shop All</Link>
                          <Link href="/about" className="text-lg font-medium text-foreground/80 hover:text-primary">About Us</Link>
                          {categories.map((category) => (
                          <Link key={category.id} href={`/category/${category.id}`} className="text-lg font-medium text-foreground/80 hover:text-primary">
                              {category.name}
                          </Link>
                          ))}
                      </nav>
                  </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="hidden md:flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">BazaarGo</span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="w-full max-w-lg">
                <form>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="search" placeholder="Search products..." className="pl-12 h-12 text-base" />
                  </div>
                </form>
            </div>
        </div>
        
        {/* Right Side: Icons */}
        <div className="flex items-center">
            <nav className="flex items-center">
              <div className="hidden md:flex items-center space-x-1">
                  <Link href="/wishlist" passHref>
                    <Button variant="ghost" size="icon" className="relative">
                        <Heart className="h-6 w-6" />
                        {isMounted && wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                                {wishlistCount}
                            </span>
                        )}
                        <span className="sr-only">Wishlist</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-6 w-6" />
                        <span className="sr-only">User Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isMounted && isAuthenticated ? (
                        <>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                           <Link href="/profile" passHref>
                            <DropdownMenuItem>
                              <UserCircle className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href="/orders" passHref>
                            <DropdownMenuItem>
                              <ListOrdered className="mr-2 h-4 w-4" />
                              <span>My Orders</span>
                            </DropdownMenuItem>
                          </Link>
                           <Link href="/settings" passHref>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Settings</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href="/login" passHref>
                            <DropdownMenuItem>
                              <LogIn className="mr-2 h-4 w-4" />
                              <span>Log In</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href="/signup" passHref>
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Sign Up</span>
                            </DropdownMenuItem>
                          </Link>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              <Link href="/cart" passHref>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {isMounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
            </nav>
        </div>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-12 items-center justify-center border-t">
          <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="text-foreground transition-colors hover:text-primary">Home</Link>
              <Link href="/shop" className="text-foreground transition-colors hover:text-primary">Shop All</Link>
              <Link href="/about" className="text-foreground transition-colors hover:text-primary">About Us</Link>
              {categories.map((category) => (
                  <Link key={category.id} href={`/category/${category.id}`} className="text-foreground transition-colors hover:text-primary">
                      {category.name}
                  </Link>
              ))}
          </nav>
      </div>
    </header>
  );
}
