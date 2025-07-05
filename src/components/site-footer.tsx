
'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { initialCategories } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { Category } from '@/lib/types';
import Image from 'next/image';

const WEBSITE_SETTINGS_KEY = 'websiteSettings';
const CATEGORIES_KEY = 'appCategories';

export function SiteFooter() {
  const [settings, setSettings] = useState({ storeName: 'BazaarGo', logoUrl: '' });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = () => {
        try {
            const savedSettingsJson = localStorage.getItem(WEBSITE_SETTINGS_KEY);
            if (savedSettingsJson) {
                const savedSettings = JSON.parse(savedSettingsJson);
                setSettings(currentSettings => {
                    const newSettings = { ...currentSettings, ...savedSettings };
                    return JSON.stringify(currentSettings) !== JSON.stringify(newSettings) ? newSettings : currentSettings;
                });
            }
            
            const savedCategoriesJSON = localStorage.getItem(CATEGORIES_KEY);
            const newCategories = savedCategoriesJSON ? JSON.parse(savedCategoriesJSON) : initialCategories;
            setCategories(currentCategories => {
                 return JSON.stringify(currentCategories) !== JSON.stringify(newCategories) ? newCategories : currentCategories;
            });
        } catch (error) {
            console.error("Failed to load settings for footer", error);
        }
    };
    
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);

  }, []);

  return (
    <footer className="mt-auto border-t bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
             <Link href="/" className="mb-4 flex items-center space-x-2">
                {settings.logoUrl ? (
                    <div className="relative" style={{width: 'auto', height: '24px'}}>
                       <Image src={settings.logoUrl} alt={settings.storeName} layout="fill" objectFit="contain" />
                    </div>
                ) : (
                    <ShoppingBag className="h-6 w-6 text-primary" />
                )}
                <span className="font-bold font-headline">{settings.storeName}</span>
            </Link>
            <p className="text-muted-foreground text-sm">Your one-stop online marketplace.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 font-headline">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
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
          <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
