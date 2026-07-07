import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { useNotifications } from "./NotificationContext";
import type { Product } from "../types";
import { filterProducts as filterProductsByCriteria, getProductById, getProducts } from "../lib/dataService";

export interface CartItem extends Product {
  quantity: number;
  variation: string;
}

interface CommerceContextValue {
  cartItems: CartItem[];
  wishlist: string[];
  recentViews: string[];
  compareItems: string[];
  searchQuery: string;
  categoryFilter: string;
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleCompareItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  clearFilters: () => void;
  getProduct: (value: string) => Product | undefined;
  filterProducts: (options?: { query?: string; category?: string }) => Product[];
  addRecentView: (productId: string) => void;
  wishlistCount: number;
  clearCart: () => void;
}

const CommerceContext = createContext<CommerceContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  cart: "enterprise_commerce_cart",
  wishlist: "enterprise_commerce_wishlist",
  recentViews: "enterprise_commerce_recent_views",
  compare: "enterprise_commerce_compare"
};

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadJson(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadJson(STORAGE_KEYS.wishlist, []));
  const [recentViews, setRecentViews] = useState<string[]>(() => loadJson(STORAGE_KEYS.recentViews, []));
  const [compareItems, setCompareItems] = useState<string[]>(() => loadJson(STORAGE_KEYS.compare, []));
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.recentViews, JSON.stringify(recentViews));
  }, [recentViews]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareItems));
  }, [compareItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const { addNotification } = useNotifications();

  const addToCart = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    setCartItems((current) => {
      const existing = current.find((item) => item.id === productId);
      if (existing) {
        return current.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1, variation: "Default" }];
    });

    addNotification({
      type: "success",
      title: "Added to Cart",
      message: `${product.name} has been added to your cart.`
    });
  }, [addNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    setWishlist((current) => {
      const isIncluded = current.includes(productId);
      const next = isIncluded
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      
      addNotification({
        type: "info",
        title: isIncluded ? "Removed from Wishlist" : "Added to Wishlist",
        message: isIncluded 
          ? `${product.name} removed from your favorites.`
          : `${product.name} added to your favorites.`
      });
      
      return next;
    });
  }, [addNotification]);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("");
  }, []);

  const getProduct = useCallback((value: string) => {
    return getProductById(value) ?? getProducts().find((product) => product.name.toLowerCase() === value.toLowerCase());
  }, []);

  const filterProducts = useCallback(({ query = "", category = "" } = {}) => {
    return filterProductsByCriteria({ query, category });
  }, []);

  const addRecentView = useCallback((productId: string) => {
    setRecentViews((current) => {
      const next = [productId, ...current.filter((item) => item !== productId)];
      return next.slice(0, 10);
    });
  }, []);

  const toggleCompareItem = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    setCompareItems((current) => {
      const isIncluded = current.includes(productId);
      if (!isIncluded && current.length >= 4) {
        addNotification({
          type: "error",
          title: "Comparison Limit Reached",
          message: "You can compare up to 4 products at a time."
        });
        return current;
      }

      const next = isIncluded
        ? current.filter((id) => id !== productId)
        : [...current, productId];

      addNotification({
        type: "info",
        title: isIncluded ? "Removed from Comparison" : "Added to Comparison",
        message: isIncluded
          ? `${product.name} removed from comparison.`
          : `${product.name} added to comparison.`
      });

      return next;
    });
  }, [addNotification]);

  const isInCompare = useCallback((productId: string) => compareItems.includes(productId), [compareItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      wishlist,
      recentViews,
      compareItems,
      searchQuery,
      categoryFilter,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      isInWishlist,
      toggleCompareItem,
      isInCompare,
      setSearchQuery,
      setCategoryFilter,
      clearFilters,
      getProduct,
      filterProducts,
      addRecentView,
      wishlistCount,
      clearCart,
    }),
    [cartItems, wishlist, recentViews, compareItems, searchQuery, categoryFilter, cartCount, cartTotal, addToCart, removeFromCart, updateCartQuantity, toggleWishlist, isInWishlist, toggleCompareItem, isInCompare, clearFilters, getProduct, filterProducts, addRecentView, wishlistCount, clearCart]
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce must be used within CommerceProvider");
  }
  return context;
}
