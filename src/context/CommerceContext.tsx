import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { useNotifications } from "./NotificationContext";
import type { Product } from "../types";
import api from "../services/api";

export interface CartItem extends Product {
  quantity: number;
  variation: string;
  variationId?: string;
  category: string;
  image: string;
  discountAmount: number;
  discountType: string;
  tax_rate: number;
  tax_type: string;
}

interface CommerceContextValue {
  cartItems: CartItem[];
  wishlistItems: Product[];
  recentViews: number[];
  compareItems: number[];
  searchQuery: string;
  categoryFilter: string;
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: number, quantity?: number, variantId?: number) => void;
  removeFromCart: (productId: number, variantId?: number) => void;
  updateCartQuantity: (productId: number, delta: number, variantId?: number) => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleCompareItem: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  clearFilters: () => void;
  getProduct: (value: number) => Promise<Product | undefined>;
  getProductById: (id: number) => Promise<Product | undefined>;
  filterProducts: (options?: { query?: string; category?: string }) => Product[];
  addRecentView: (productId: number) => void;
  wishlistCount: number;
  clearCart: () => void;
  clearWishlist: () => void;
  wishlist: Product[];
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
  const [wishlist, setWishlist] = useState<number[]>(() => loadJson(STORAGE_KEYS.wishlist, []));
  const [recentViews, setRecentViews] = useState<number[]>(() => loadJson(STORAGE_KEYS.recentViews, []));
  const [compareItems, setCompareItems] = useState<number[]>(() => loadJson(STORAGE_KEYS.compare, []));
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

  const getProductById = useCallback(async (id: number): Promise<Product | undefined> => {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        return response.data.data.product;
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

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

  const addToCart = useCallback(async (productId: number, quantity: number = 1, variantId?: number) => {
    const product = await getProductById(productId);
    if (!product) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Product not found."
      });
      return;
    }
    
    setCartItems((current) => {
      const normalizedProductId = String(productId);
      const normalizedVariantId = String(variantId ?? "");

      const existing = current.find(
          item =>
              String(item.id) === normalizedProductId &&
              String(item.variationId ?? "") === normalizedVariantId
      );

      // If exists, only update quantity
      if (existing) {
        return current.map(item =>
            String(item.id) === normalizedProductId &&
            String(item.variationId ?? "") === normalizedVariantId

                ? {
                    ...item,
                    quantity: item.quantity + quantity
                }

                : item
        );
      }

      // Calculate variant price
      let variantPrice = product.sale_price || product.price;
      let variationName = "";

      if (normalizedVariantId && product.variants) {
        const variant = product.variants.find(
          (v: any) => v.id?.toString() === normalizedVariantId
        );

        if (variant) {
          variantPrice = variant.price;
          variationName = variant.name;
        }
      }

      // Create new cart item
      const cartItem: CartItem = {
        ...product,
        price:
          typeof variantPrice === "string"
            ? parseFloat(variantPrice)
            : variantPrice,
        quantity,
        variationId: normalizedVariantId,
        variation: variationName,
        image: product.thumbnail ?? "",
        category: product.category_name ?? "",
        discountAmount:
          typeof product.discount_amount === "string"
            ? parseFloat(product.discount_amount)
            : product.discount_amount ?? 0,
        discountType: product.discount_type ?? "",
        tax_rate:
          typeof product.tax_rate === "string"
            ? parseFloat(product.tax_rate)
            : product.tax_rate ?? 0,
        tax_type: product.tax_type ?? "",
      };

      return [...current, cartItem];
    });

    addNotification({
      type: "success",
      title: "Added to Cart",
      message: `${product.name} has been added to your cart.`
    });
  }, [addNotification, getProductById]);

  const removeFromCart = useCallback((productId: number, variantId?: number) => {
    const normalizedProductId = String(productId);
    const normalizedVariantId = String(Number.isNaN(variantId) ? "" : (variantId ?? ""));

    setCartItems((current) =>
      current.filter((item) => {
        if (variantId !== undefined && variantId !== null && !Number.isNaN(variantId)) {
          return !(
            String(item.id) === normalizedProductId &&
            String(item.variationId ?? "") === normalizedVariantId
          );
        }
        return !(String(item.id) === normalizedProductId && !item.variationId);
      })
    );
  }, []);

  const updateCartQuantity = useCallback((productId: number, variantId?: number, delta?: number) => {
    const normalizedProductId = String(productId);
    const normalizedVariantId = String(variantId ?? "");
    const normalizedDelta = delta ?? 1;
    setCartItems((current) =>
      current.map((item) => {
        if (variantId !== undefined && variantId !== null && !Number.isNaN(variantId)) {
          return String(item.id) === normalizedProductId &&
            String(item.variationId ?? "") === normalizedVariantId
            ? { ...item, quantity: Math.max(1, item.quantity + normalizedDelta) }
            : item;
        }
        return String(item.id) === normalizedProductId && !item.variationId
          ? { ...item, quantity: Math.max(1, item.quantity + normalizedDelta) }
          : item;
      })
    );
  }, []);

  const toggleWishlist = useCallback(async (productId: number) => {
    const product = await getProductById(productId);

    if (!product) return;

    setWishlist((current) => {

        const isIncluded = current.includes(productId);
        
        const next = isIncluded
            ? current.filter(id => id !== productId)
            : [...current, productId];

        addNotification({
            type: "info",
            title: isIncluded
                ? "Removed from Wishlist"
                : "Added to Wishlist",
            message: isIncluded
                ? `${product.name} removed from your favorites.`
                : `${product.name} added to your favorites.`,
        });

        return next;
    });

}, [addNotification, getProductById]);

  const isInWishlist = useCallback((productId: number) => wishlist.includes(productId), [wishlist]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("");
  }, []);

  const getProduct = useCallback(async (value: number) => {
    try {
      const product = await getProductById(value);
      return product;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, [getProductById]);

  const filterProducts = useCallback(({ query = "", category = "" } = {}): Product[] => {
    return [];
  }, []);

  const addRecentView = useCallback((productId: number) => {
    setRecentViews((current) => {
      const next = [productId, ...current.filter((item) => item !== productId)];
      return next.slice(0, 10);
    });
  }, []);

  const toggleCompareItem = useCallback(async (productId: number) => {
    const product = await getProductById(productId);
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
  }, [addNotification, getProductById]);

  const isInCompare = useCallback((productId: number) => compareItems.includes(productId), [compareItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log("Wishlist IDs:", wishlist);
    const loadWishlistProducts = async () => {
      const products: Product[] = [];
      for (const productId of wishlist) {
        try {
          const product = await getProductById(productId);
          if (product) {
            products.push(product);
          }
        } catch (error) {
          console.error(`Failed to load wishlist product ${productId}:`, error);
        }
      }
      setWishlistProducts(products);
    };

    if (wishlist.length > 0) {
      loadWishlistProducts();
    } else {
      setWishlistProducts([]);
    }
  }, [wishlist, getProductById]);

  const wishlistItems = useMemo(() => wishlistProducts, [wishlistProducts]);

  const value = useMemo(
    () => ({
      cartItems,
      wishlist: wishlistItems,
      wishlistItems,
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
      getProductById,
      filterProducts,
      addRecentView,
      wishlistCount,
      clearCart,
      clearWishlist,
    }),
    [cartItems, wishlistItems, recentViews, compareItems, searchQuery, categoryFilter, cartCount, cartTotal, addToCart, removeFromCart, updateCartQuantity, toggleWishlist, isInWishlist, toggleCompareItem, isInCompare, clearFilters, getProduct, getProductById, filterProducts, addRecentView, wishlistCount, clearCart, clearWishlist]
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
