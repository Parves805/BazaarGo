'use client';

import { Search, User, Heart, ShoppingBag, Menu, LogIn, UserPlus, UserCircle, Settings, LogOut, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { CartSheet } from './cart-sheet';
import { useState } from 'react';

export function SiteHeader() {
  // Mock authentication state. In a real app, you'd use a context or auth library.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                          <Link href="/shop" className="text-lg font-medium text-foreground/80 hover:text-primary">Shop All</Link>
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
                  <Button variant="ghost" size="icon">
                      <Heart className="h-6 w-6" />
                      <span className="sr-only">Wishlist</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-6 w-6" />
                        <span className="sr-only">User Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAuthenticated ? (
                        <>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ListOrdered className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
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
               <CartSheet />
            </nav>
        </div>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-12 items-center justify-center border-t">
          <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/shop" className="text-foreground transition-colors hover:text-primary">Shop All</Link>
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
