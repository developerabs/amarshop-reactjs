export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
  soldCount?: string;
  inStock?: boolean;
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
