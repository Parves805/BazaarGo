
export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  tags: string[];
  sizes?: string[];
  colors?: { name: string; hex: string; image?: string; }[];
  createdAt?: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  image: string;
  bannerImage: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    paymentMethod: string;
  };
  userId?: string; // To associate orders with users
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  timestamp: string;
  userId?: string; // To associate reviews with users
}

export interface PopupCampaign {
  enabled: boolean;
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  displayDuration: number; // in seconds
}

export interface WebsiteSettings {
  storeName: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface AiSettings {
    recommendationsEnabled: boolean;
}

export interface PaymentGatewaySettings {
    cashOnDelivery: boolean;
    bkash: boolean;
    nagad: boolean;
    rocket: boolean;
}

export interface SeoSettings {
  titleTemplate: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface HomepageSection {
  id: string;
  title: string;
  mainImageUrl: string;
  categorySlug: string;
}

export interface PromoCard {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

export interface PromoSection {
    id: string;
    cards: PromoCard[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    avatar?: string;
}

export interface UserThread {
    threadId: string; // Often the user's ID
    userName: string;
    messages: {
        sender: 'user' | 'admin';
        text: string;
        timestamp: string;
    }[];
    lastMessageTimestamp: string;
    lastAdminSeenTimestamp?: string;
}

export interface Notification {
  id: string;
  message: string;
  imageUrl?: string;
  timestamp: string; // ISO String
}
