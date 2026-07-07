import { Category, Product, Slide } from "../types";

export const CATEGORIES: Category[] = [
  { id: "1", name: "Panjabi", icon: "Shirt", image: "https://picsum.photos/seed/panjabi/400/400" },
  { id: "2", name: "Saree", icon: "Flower", image: "https://picsum.photos/seed/saree/400/400" },
  { id: "3", name: "Electronics", icon: "Smartphone", image: "https://picsum.photos/seed/electronics/400/400" },
  { id: "4", name: "Groceries", icon: "ShoppingBasket", image: "https://picsum.photos/seed/groceries/400/400" },
  { id: "5", name: "Beauty", icon: "Sparkles", image: "https://picsum.photos/seed/beauty/400/400" },
  { id: "6", name: "Home", icon: "Home", image: "https://picsum.photos/seed/home/400/400" },
  { id: "7", name: "Shoes", icon: "Footprints", image: "https://picsum.photos/seed/shoes/400/400" },
  { id: "8", name: "Kids", icon: "Baby", image: "https://picsum.photos/seed/kids/400/400" },
  { id: "9", name: "Watches", icon: "Watch", image: "https://picsum.photos/seed/watch/400/400" },
  { id: "10", name: "Bags", icon: "ShoppingBag", image: "https://picsum.photos/seed/bag/400/400" },
  { id: "11", name: "Sports", icon: "Trophy", image: "https://picsum.photos/seed/sports/400/400" },
  { id: "12", name: "Books", icon: "Book", image: "https://picsum.photos/seed/book/400/400" },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Nike Air Max 270 React Bauhaus Men's Running Shoes Special Edition",
    price: 120,
    originalPrice: 160,
    discount: 25,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    category: "Shoes",
    rating: 4.5,
    reviews: 124,
    isNew: true,
    soldCount: "1.2k",
    inStock: true,
  },
  {
    id: "p2",
    name: "Jamdani Saree - Traditional Red Silk",
    price: 8500,
    originalPrice: 12000,
    discount: 29,
    image: "https://picsum.photos/seed/saree1/600/800",
    category: "Saree",
    rating: 4.9,
    reviews: 86,
    soldCount: "450",
    inStock: true,
  },
  {
    id: "p3",
    name: "Smartphone X12 - 128GB Midnight Black",
    price: 28999,
    image: "https://picsum.photos/seed/phone1/600/800",
    category: "Electronics",
    rating: 4.5,
    reviews: 210,
    isNew: true,
    soldCount: "2.1k",
    inStock: true,
  },
  {
    id: "p4",
    name: "Pure Mustard Oil - 5L Premium Quality",
    price: 1150,
    originalPrice: 1250,
    discount: 8,
    image: "https://picsum.photos/seed/oil1/600/800",
    category: "Groceries",
    rating: 4.7,
    reviews: 450,
    soldCount: "5.4k",
    inStock: true,
  },
  {
    id: "p5",
    name: "Leather Formal Shoes - Classic Brown",
    price: 3400,
    originalPrice: 4500,
    discount: 24,
    image: "https://picsum.photos/seed/shoes1/600/800",
    category: "Shoes",
    rating: 4.6,
    reviews: 56,
    soldCount: "120",
    inStock: false,
  },
  {
    id: "p6",
    name: "Designer Salwar Kameez - Festive Edition",
    price: 4200,
    image: "https://picsum.photos/seed/dress1/600/800",
    category: "Saree",
    rating: 4.8,
    reviews: 32,
    isNew: true,
    soldCount: "85",
    inStock: true,
  },
  {
    id: "p7",
    name: "Premium Cotton Panjabi - Sky Blue",
    price: 2500,
    originalPrice: 3200,
    discount: 22,
    image: "https://picsum.photos/seed/panjabi1/600/800",
    category: "Panjabi",
    rating: 4.7,
    reviews: 150,
    soldCount: "1.5k",
    inStock: true,
  },
  {
    id: "p8",
    name: "Wireless Earbuds Pro - Noise Cancelling",
    price: 4500,
    originalPrice: 5500,
    discount: 18,
    image: "https://picsum.photos/seed/earbuds/600/800",
    category: "Electronics",
    rating: 4.8,
    reviews: 320,
    isNew: true,
    soldCount: "3.2k",
    inStock: true,
  },
  {
    id: "p9",
    name: "Luxury Gold Watch - Men's Edition",
    price: 12500,
    originalPrice: 15000,
    discount: 17,
    image: "https://picsum.photos/seed/watch1/600/800",
    category: "Watches",
    rating: 4.9,
    reviews: 45,
    soldCount: "200",
    inStock: true,
  },
  {
    id: "p10",
    name: "Leather Travel Bag - Large Capacity",
    price: 5800,
    originalPrice: 7200,
    discount: 19,
    image: "https://picsum.photos/seed/bag1/600/800",
    category: "Bags",
    rating: 4.6,
    reviews: 88,
    soldCount: "540",
    inStock: true,
  },
  {
    id: "p11",
    name: "Organic Honey - 500g Pure Natural",
    price: 650,
    originalPrice: 750,
    discount: 13,
    image: "https://picsum.photos/seed/honey/600/800",
    category: "Groceries",
    rating: 4.8,
    reviews: 1200,
    soldCount: "10k+",
    inStock: true,
  },
  {
    id: "p12",
    name: "Running Sneakers - Ultra Lightweight",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    image: "https://picsum.photos/seed/sneakers/600/800",
    category: "Shoes",
    rating: 4.5,
    reviews: 670,
    soldCount: "4.1k",
    inStock: true,
  },
];

export const BLOG_POSTS = [
  {
    id: "b1",
    title: "Top 10 Fashion Trends for Eid 2026",
    excerpt: "Discover the latest styles in Panjabis and Sarees that are taking the festive season by storm...",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
    date: "April 5, 2026",
    author: "Sarah Ahmed",
    category: "Fashion"
  },
  {
    id: "b2",
    title: "How to Choose the Perfect Smartphone",
    excerpt: "With so many options available, finding the right phone can be tough. Here's our comprehensive guide...",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    date: "April 3, 2026",
    author: "Tech Guru",
    category: "Gadgets"
  },
  {
    id: "b3",
    title: "5 Healthy Recipes Using Organic Honey",
    excerpt: "Boost your immunity and satisfy your sweet tooth with these delicious and easy-to-make recipes...",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
    date: "April 1, 2026",
    author: "Chef Maria",
    category: "Lifestyle"
  }
];

export const BRANDS = [
  { id: "br1", name: "Nike", image: "https://picsum.photos/seed/nike/200/200" },
  { id: "br2", name: "Adidas", image: "https://picsum.photos/seed/adidas/200/200" },
  { id: "br3", name: "Samsung", image: "https://picsum.photos/seed/samsung/200/200" },
  { id: "br4", name: "Apple", image: "https://picsum.photos/seed/apple/200/200" },
  { id: "br5", name: "Sony", image: "https://picsum.photos/seed/sony/200/200" },
  { id: "br6", name: "Puma", image: "https://picsum.photos/seed/puma/200/200" },
  { id: "br7", name: "Gucci", image: "https://picsum.photos/seed/gucci/200/200" },
  { id: "br8", name: "Prada", image: "https://picsum.photos/seed/prada/200/200" },
  { id: "br9", name: "Zara", image: "https://picsum.photos/seed/zara/200/200" },
  { id: "br10", name: "H&M", image: "https://picsum.photos/seed/hm/200/200" },
  { id: "br11", name: "Levi's", image: "https://picsum.photos/seed/levis/200/200" },
  { id: "br12", name: "Rolex", image: "https://picsum.photos/seed/rolex/200/200" },
];

export const CLIENT_REVIEWS = [
  {
    id: "rev1",
    title: "Amazing Shopping Experience!",
    youtubeId: "dQw4w9WgXcQ", // Placeholder
    clientName: "John Doe",
    rating: 5,
  },
  {
    id: "rev2",
    title: "Best Quality Products",
    youtubeId: "jNQXAC9IVRw", // Placeholder
    clientName: "Jane Smith",
    rating: 5,
  },
  {
    id: "rev3",
    title: "Fast Delivery and Great Support",
    youtubeId: "9bZkp7q19f0", // Placeholder
    clientName: "Robert Wilson",
    rating: 4,
  },
  {
    id: "rev4",
    title: "Highly Recommended Store",
    youtubeId: "L_jWHffIx5E", // Placeholder
    clientName: "Emily Davis",
    rating: 5,
  }
];

export const FAQS = [
  {
    id: "faq1",
    question: "What are your delivery charges?",
    answer: "We offer free delivery on orders over $50. For orders below $50, a flat shipping fee of $5 applies nationwide."
  },
  {
    id: "faq2",
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for 1-2 day delivery."
  },
  {
    id: "faq3",
    question: "What is your return policy?",
    answer: "We have a 30-day return policy. If you're not satisfied with your purchase, you can return it in its original condition for a full refund or exchange."
  },
  {
    id: "faq4",
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."
  },
  {
    id: "faq5",
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking number via email. You can use this number on our website to track your package in real-time."
  }
];

export const SLIDES: Slide[] = [
  {
    id: "s1",
    title: "Eid Collection 2026",
    subtitle: "Up to 50% Off on Panjabis & Sarees",
    image: "https://picsum.photos/seed/eid/1920/1080",
    buttonText: "Shop Now",
    color: "bg-emerald-600",
  },
  {
    id: "s2",
    title: "Smart Living",
    subtitle: "Latest Electronics at Best Prices",
    image: "https://picsum.photos/seed/tech/1920/1080",
    buttonText: "Explore More",
    color: "bg-blue-600",
  },
  {
    id: "s3",
    title: "Daily Essentials",
    subtitle: "Fresh Groceries Delivered to Your Door",
    image: "https://picsum.photos/seed/grocery/1920/1080",
    buttonText: "Order Now",
    color: "bg-orange-600",
  },
];
