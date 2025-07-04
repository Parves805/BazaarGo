'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, User, LayoutGrid, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/context/wishlist-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import Image from 'next/image';

const NavLink = ({ href, pathname, children }: { href: string, pathname: string, children: React.ReactNode }) => (
  <Link href={href} className={cn(
    "flex flex-col items-center justify-center gap-1 text-xs transition-colors w-full h-full",
    pathname === href ? "text-primary" : "text-muted-foreground hover:text-primary"
  )}>
    {children}
  </Link>
);

export function BottomNav() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();

  // Don't show on auth or admin pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-5 mx-auto">
        <NavLink href="/" pathname={pathname}>
          <Home className="h-6 w-6" />
          <span>Home</span>
        </NavLink>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs transition-colors w-full h-full",
              pathname.startsWith('/category') ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}>
              <LayoutGrid className="h-6 w-6" />
              <span>Categories</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] flex flex-col rounded-t-lg">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>All Categories</SheetTitle>
            </SheetHeader>
            <nav className="flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
                {categories.map((category) => (
                  <SheetClose asChild key={category.id}>
                    <Link
                      href={`/category/${category.id}`}
                      className="group flex flex-col items-center text-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-secondary/50 transition-colors"
                    >
                      <div className="relative h-16 w-16 mb-2">
                         <Image src={category.image} alt={category.name} fill className="object-contain" />
                      </div>
                      <span className="font-medium text-sm text-center">{category.name}</span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <NavLink href="/shop" pathname={pathname}>
          <ShoppingBag className="h-6 w-6" />
          <span>Shop</span>
        </NavLink>

        <NavLink href="/wishlist" pathname={pathname}>
            <div className="relative">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                        {wishlistCount}
                    </span>
                )}
            </div>
          <span>Wishlist</span>
        </NavLink>

        <NavLink href="/profile" pathname={pathname}>
          <User className="h-6 w-6" />
          <span>Account</span>
        </NavLink>
      </div>
    </div>
  );
}
