import { ShoppingBag } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
             <a href="/" className="mb-4 flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">BazaarGo</span>
            </a>
            <p className="text-muted-foreground text-sm">Your one-stop online marketplace.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Half Sleeve T-shirt</a></li>
              <li><a href="#" className="hover:text-primary">Shirt</a></li>
              <li><a href="#" className="hover:text-primary">Polo T-shirt</a></li>
              <li><a href="#" className="hover:text-primary">Underwear</a></li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-3 font-headline">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">FAQ</a></li>
              <li><a href="#" className="hover:text-primary">Returns</a></li>
              <li><a href="#" className="hover:text-primary">Track Order</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
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
