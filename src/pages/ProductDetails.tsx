import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductBySlug, getProducts } from "../lib/dataService";
import ProductCard from "../components/ProductCard";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Info,
  HelpCircle,
  FileText,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice, cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { useCommerce } from "../context/CommerceContext";
import SEO from "../components/SEO";
import api from "../services/api";

type ProductVariant = {
  id: number;
  name: string;
  price: string;
  cost: string;
  stock: number;
  image: string | null;
  attributes: Record<string, string>;
};

type ApiProduct = {
  id: number;
  code: string;
  name: string;
  slug: string;
  price: string;
  cost: string;
  sale_price?: string | null;
  total_stock: number;
  short_description: string | null;
  description: string | null;
  thumbnail: string | null;
  image: string | string[] | null;
  images?: string[] | null;
  is_new_arrival: boolean;
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  attributes?: Record<string, string[]>;
};

const buildFallbackProduct = (identifier: string | undefined): ApiProduct | null => {
  if (!identifier) return null;

  const localProduct = getProductById(identifier) ?? getProductBySlug(identifier);
  if (!localProduct) return null;

  const normalizedId = Number.parseInt(String(localProduct.id).replace(/\D/g, ""), 10);

  return {
    id: Number.isNaN(normalizedId) ? 1 : normalizedId,
    code: `AS-${String(localProduct.id).toUpperCase()}`,
    name: localProduct.name,
    slug: localProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    price: String(localProduct.price),
    cost: String(Math.max(0, localProduct.price - 500)),
    total_stock: localProduct.inStock ? 25 : 0,
    short_description: `Premium ${localProduct.category.toLowerCase()} selection designed for comfort and style.`,
    description: `Explore ${localProduct.name}, crafted with care and available for quick delivery across Bangladesh.`,
    thumbnail: localProduct.image,
    image: localProduct.image,
    is_new_arrival: Boolean(localProduct.isNew),
    category: {
      name: localProduct.category,
      slug: localProduct.category.toLowerCase().replace(/\s+/g, "-"),
    },
    variants: [],
    attributes: {},
  };
};

export default function ProductDetails() {
  const params = useParams<{ productName?: string; productSlug?: string; id?: string  }>();
  const productName = params.productName || params.productSlug || params.id;
  const productSlug = params.productSlug || params.productName || params.id;
  const navigate = useNavigate();
  const { addRecentView, addToCart, toggleWishlist, isInWishlist } = useCommerce();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (!productName) {
      setError("Product identifier is missing from the URL.");
      setLoading(false);
      return;
    }

    const fallbackProduct = buildFallbackProduct(productName);
    if (fallbackProduct) {
      setProduct(fallbackProduct);
    } else {
      setProduct(null);
    }

    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setLoading(false);
      if (!fallbackProduct) {
        setError("Product details not found.");
      }
      return;
    }

    const requestSlug = productSlug || productName;

    api.get(`/products/details/${requestSlug}`)
      .then((response) => {
        const data = response?.data;
        const rawProduct = data?.data?.product ?? data?.data ?? data?.product;

        if (!rawProduct) {
          if (fallbackProduct) {
            setProduct(fallbackProduct);
            setError(null);
          } else {
            setError(data?.message || "Product details not found.");
            setProduct(null);
          }
          return;
        }

        const attributes = data?.data?.attributes ?? rawProduct?.attributes;
        const variantSource = data?.data?.variants ?? rawProduct?.variants;

        const normalizedVariants = Array.isArray(variantSource)
          ? variantSource.map((variant: any) => {
              const normalizedAttributes: Record<string, string> = {};
              if (variant?.attributes && typeof variant.attributes === "object") {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                  if (typeof value === "string") {
                    normalizedAttributes[key] = value;
                  }
                });
              }

              if (Array.isArray(variant?.variant_values)) {
                variant.variant_values.forEach((value: any) => {
                  if (value?.attribute_name && value?.attribute_value) {
                    normalizedAttributes[value.attribute_name] = value.attribute_value;
                  }
                });
              }

              return {
                id: variant.id,
                name: variant.name,
                price: variant.additional_price ?? variant.price ?? rawProduct.price,
                cost: variant.additional_cost ?? variant.cost ?? rawProduct.cost,
                stock: variant.stock ?? 0,
                image: variant.image ?? null,
                attributes: normalizedAttributes,
              };
            })
          : [];

        const normalizedImages = [
          ...(Array.isArray(rawProduct.images)
            ? rawProduct.images.filter((img: unknown): img is string => typeof img === "string" && img.trim().length > 0)
            : []),
          ...(Array.isArray(rawProduct.image)
            ? rawProduct.image.filter((img: unknown): img is string => typeof img === "string" && img.trim().length > 0)
            : typeof rawProduct.image === "string"
            ? [rawProduct.image]
            : []),
        ];

        setProduct({
          ...rawProduct,
          image: normalizedImages[0] ?? rawProduct.thumbnail ?? null,
          thumbnail: rawProduct.thumbnail ?? normalizedImages[0] ?? null,
          images: normalizedImages,
          price: rawProduct.sale_price ?? rawProduct.price ?? "0",
          cost: rawProduct.cost ?? rawProduct.price ?? "0",
          short_description: rawProduct.short_description ?? rawProduct.description ?? null,
          description: rawProduct.description ?? rawProduct.short_description ?? null,
          attributes,
          variants: normalizedVariants,
        });
      })
      .catch(() => {
        if (fallbackProduct) {
          setProduct(fallbackProduct);
          setError(null);
        } else {
          console.error("Error fetching product details for:", productName);
          setError("Unable to fetch product details.");
          setProduct(null);
        }
      })
      .finally(() => setLoading(false));
  }, [productName]);

  useEffect(() => {
    if (!product) return;
    addRecentView(product.id.toString());
    window.scrollTo(0, 0);
  }, [product?.id, addRecentView]);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.attributes?.Color?.[0] ?? "");
    setSelectedSize(product.attributes?.Size?.[0] ?? "");
  }, [product]);

  const isValidImage = (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    const normalized = value.trim().toLowerCase();
    return Boolean(normalized) && !normalized.includes("null") && !normalized.includes("undefined");
  };

  const mainImage = isValidImage(product?.thumbnail) ? product.thumbnail : null;

  const galleryImages = product?.images
    ? product.images.filter((img): img is string => isValidImage(img))
    : [];

  const images = mainImage
    ? [mainImage, ...galleryImages].filter((img, index, arr) => Boolean(img) && arr.indexOf(img) === index)
    : galleryImages;

  const productImage = images[0] ?? null;

  const selectedVariant = product?.variants?.find(
    (variant) =>
      Boolean(variant.attributes) &&
      variant.attributes?.Color === selectedColor &&
      variant.attributes?.Size === selectedSize
  );

  const displayedPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product?.sale_price ?? 0);
  const displayedAdditionalPrice = Number(product?.price ?? 0);
  const stockCount = selectedVariant?.stock ?? product?.total_stock ?? 0;
  const stockLabel = stockCount > 0 ? `${stockCount} in stock` : "Out of stock";
  const categoryName = product?.category?.name ?? "Uncategorized";
  const brandName = product?.brand?.name ?? null;

  const colorOptions = product?.attributes?.Color ?? [];
  const sizeOptions = product?.attributes?.Size ?? [];
  const productDescription =
    product?.short_description ||
    product?.description ||
    "This premium product is crafted with attention to detail, ready for everyday style and comfort.";

  const isWishlisted = product ? isInWishlist(String(product.id)) : false;

  const handleShare = async () => {
    if (!product) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product at AmarShop`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        window.alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquiry = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hi AmarShop, I'm interested in the ${product.name} (Ref: ${product.id}). Can I get more details?`
    );
    window.open(`https://wa.me/8801234567890?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse mx-auto" />
          <p className="text-gray-500 uppercase tracking-[0.3em] text-xs">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight font-display">Product Not Found</h2>
          <p className="text-sm text-gray-500 max-w-md">{error || "We couldn’t locate the product you’re looking for."}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
          >
            Return to Collection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <SEO
        title={`${product.name} | AmarShop Premium`}
        description={`Shop ${product.name} in ${categoryName} at AmarShop. High-quality premium goods with fast delivery across Bangladesh.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button onClick={() => navigate('/')} className="hover:text-emerald-600">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/products')} className="hover:text-emerald-600">{categoryName}</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
          {/* Left: Media Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-luxury border border-gray-100 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute bottom-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleShare} className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:bg-emerald-600 hover:text-white transition-all text-gray-900">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleWishlist(String(product.id))}
                  className={`p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl transition-all ${isWishlisted ? "text-red-500" : "text-gray-900 hover:text-red-500"}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-24 sm:w-24 sm:h-28 rounded-3xl border-2 overflow-hidden flex-shrink-0 transition-all duration-500 ${activeImageIndex === i ? 'border-emerald-500 scale-95 shadow-lg' : 'border-gray-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details (6 cols) */}
          <div className="lg:col-span-6 flex flex-col pt-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    {categoryName}
                  </span>
                  {product.is_new_arrival && (
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      New Arrival
                    </span>
                  )}
                  {brandName && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                      {brandName}
                    </span>
                  )}
                  <div className="h-4 w-[1px] bg-gray-200" />
                  <div className="text-[10px] font-bold text-gray-400">
                    {product.code} · {stockLabel}
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight font-display">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                  {formatPrice(displayedPrice)}
                </span>
                {displayedAdditionalPrice > 0 && (
                  <span className="text-sm text-gray-500 font-semibold uppercase tracking-[0.2em]">
                    {formatPrice(displayedAdditionalPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed max-w-xl font-medium italic border-l-4 border-emerald-500 pl-4 bg-gray-50 py-4 rounded-r-2xl">
                {productDescription}
              </p>

              {/* Selection Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedColor === color ? "bg-gray-900 text-white border-gray-900 shadow-xl" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200"}`}
                      >
                        {color}
                      </button>
                    ))}
                    {!colorOptions.length && <span className="text-xs text-gray-400">No color options available</span>}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select size</label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all border-2 ${selectedSize === size ? "bg-gray-900 text-white border-gray-900 shadow-xl scale-110" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200"}`}
                      >
                        {size}
                      </button>
                    ))}
                    {!sizeOptions.length && <span className="text-xs text-gray-400">No size options available</span>}
                  </div>
                </div>
              </div>

              {/* Quantity and CTA */}
              <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-6">
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart(String(product.id));
                  }}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all active:scale-95 shadow-2xl shadow-emerald-200 group"
                >
                  <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                  Add to Shopping Bag
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    addToCart(String(product.id));
                    navigate('/checkout');
                  }}
                  className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Instant Checkout
                </button>
                <button
                  onClick={handleInquiry}
                  className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Inquiry
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-10 border-t border-gray-100">
                {[
                  { icon: ShieldCheck, label: "Authenticated", sub: "Garanteed Genuine", color: "text-emerald-600" },
                  { icon: Truck, label: "Express", sub: "2-3 Day Shipping", color: "text-blue-600" },
                  { icon: RotateCcw, label: "Easy Return", sub: "14 Days Policy", color: "text-orange-600" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-2">
                    <div className={cn("p-3 rounded-2xl bg-gray-50 transition-colors", item.color)}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-900">{item.label}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mt-24">
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar gap-8">
            {[
              { id: 'description', label: 'Details', icon: FileText },
              { id: 'specification', label: 'Specs', icon: Info },
              { id: 'variants', label: `Variants (${product.variants?.length ?? 0})`, icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-6 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabProduct" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl"
              >
                {activeTab === 'description' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-black text-gray-900 font-display">Product Narrative</h3>
                      <p className="text-gray-500 leading-relaxed text-lg font-medium">
                        {productDescription}
                      </p>
                      <ul className="space-y-4">
                        {[
                          "Exquisite attention to minute details",
                          "Durable, long-lasting premium components",
                          "Sustainably sourced and ethically manufactured",
                          "Ergonomic fit for ultimate everyday luxury",
                        ].map((li, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center mt-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                      <img src={`https://picsum.photos/seed/${product.id}det/600/600`} alt="Detail" className="w-full object-cover" />
                    </div>
                  </div>
                )}

                {activeTab === 'specification' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Product Model', value: `AS-${product.id.toString().slice(0, 8).toUpperCase()}` },
                      { label: 'Category', value: categoryName },
                      { label: 'Brand', value: brandName ?? 'Unbranded' },
                      { label: 'Stock', value: stockLabel },
                      { label: 'Variants', value: `${product.variants?.length ?? 0}` },
                      { label: 'Availability', value: product.total_stock > 0 ? 'Ready Stock' : 'Out of Stock' },
                    ].map((spec, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-emerald-50 transition-colors">
                        <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">{spec.label}</span>
                        <span className="font-black text-gray-900 text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'variants' && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {(product.variants ?? []).map((variant) => (
                        <div key={variant.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-gray-400 uppercase tracking-widest font-black">{variant.name}</p>
                              <p className="text-2xl font-black text-gray-900">{formatPrice(Number(variant.price))}</p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{variant.stock} pcs</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(variant.attributes ?? {}).map(([key, value]) => (
                              <div key={key} className="p-4 bg-gray-50 rounded-3xl text-sm font-bold text-gray-700">
                                <span className="block text-[10px] text-gray-400 uppercase tracking-widest">{key}</span>
                                {value}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedColor(variant.attributes?.Color ?? selectedColor);
                              setSelectedSize(variant.attributes?.Size ?? selectedSize);
                            }}
                            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all"
                          >
                            Select This Variant
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Curated for you</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-display">Complete The Experience</h2>
            </div>
            <button onClick={() => navigate('/products')} className="px-8 py-3 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all">
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {getProducts()
              .filter((p) => String(p.id) !== String(product.id))
              .slice(0, 4)
              .map((relatedProduct, idx) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
