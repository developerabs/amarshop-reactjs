export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  thumbnail?: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount_amount?: number;
  discount_type?: string;
  soldCount?: string;
  inStock?: boolean;
  variation?: string;
  variationId?: string;
  category_name?: string;
  sale_price?: number;
  variants?: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  tax_rate?: number;
  tax_type?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  color: string;
}
