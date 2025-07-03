
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
             <Link href="/" className="mb-4 flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">BazaarGo</span>
            </Link>
            <p className="text-muted-foreground text-sm">Your one-stop online marketplace.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-primary">Shop</Link></li>
                {categories.slice(0, 4).map((category) => (
                    <li key={category.id}><Link href={`/category/${category.id}`} className="hover:text-primary">{category.name}</Link></li>
                ))}
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-3 font-headline">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-primary">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BazaarGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
