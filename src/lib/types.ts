export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}
