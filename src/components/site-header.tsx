import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { CartSheet } from './cart-sheet';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">BazaarGo</span>
          </a>
        </div>
        
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
                    <a href="/" className="mb-6 flex items-center space-x-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">BazaarGo</span>
                    </a>
                    <nav className="flex flex-col space-y-3">
                        {categories.map((category) => (
                        <a key={category.id} href="#" className="text-lg font-medium text-foreground/80 hover:text-primary">
                            {category.name}
                        </a>
                        ))}
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-9" />
              </div>
            </form>
          </div>
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
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Orders</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
             <CartSheet />
          </nav>
        </div>
      </div>
    </header>
  );
}
