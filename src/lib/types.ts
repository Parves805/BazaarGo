
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
  colors?: { name: string; hex: string }[];
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
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  timestamp: string;
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
