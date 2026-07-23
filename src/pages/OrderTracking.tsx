import React, { useState, useEffect } from "react";
import { Truck, Search, CheckCircle, Package, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { cn } from "../lib/utils";
import api from "../services/api";

const BASE_TRACKING_STEPS = [
  { id: "ordered", label: "Order Placed", icon: Package },
  { id: "processed", label: "Processing", icon: Clock },
  { id: "shipped", label: "In Transit", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  product_id: number;
  quantity: number;
  price: string;
  total: string | null;
}

interface OrderAddress {
  name: string;
  phone: string;
  email: string | null;
  country: string | null;
  division: string | null;
  district: string | null;
  thana: string | null;
  address: string;
  postal_code: string | null;
}

interface TrackedOrder {
  order_id: string;
  subtotal: string;
  discount_amount: string;
  coupon_discount: string;
  tax_amount: string;
  shipping_charge: string;
  grand_total: string;
  payment_method: string;
  payment_status: string;
  order_status: OrderStatus;
  placed_at: string;
  order_items: OrderItem[];
  order_address: OrderAddress | null;
}

interface TrackOrderResponse {
  success: boolean;
  message: string;
  data: TrackedOrder;
}

const statusToStep: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

function formatMoney(value: string | number): string {
  const numericValue = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTime(value: string): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTracking() {
  const { orderId: routeOrderId } = useParams<{ orderId?: string }>();
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!routeOrderId || routeOrderId === "track-order") {
      return;
    }

    setOrderId(routeOrderId);
  }, [routeOrderId]);

  const fetchTrackOrder = async (id: string) => {
    setIsSearching(true);
    setErrorMessage("");
    setTrackingData(null);

    try {
      const response = await api.get<TrackOrderResponse>(`/orders/track-order/${encodeURIComponent(id)}`);

      if (response.data?.success) {
        setTrackingData(response.data.data);
      } else {
        setErrorMessage(response.data?.message || "Unable to track this order right now.");
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      setErrorMessage(serverMessage || "Order not found. Please check your Order ID and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOrderId = orderId.trim();
    if (!trimmedOrderId) return;

    await fetchTrackOrder(trimmedOrderId);
  };

  useEffect(() => {
    if (!orderId || orderId === "track-order") {
      return;
    }

    // fetchTrackOrder(orderId);
  }, [orderId]);

  const currentStep = trackingData ? statusToStep[trackingData.order_status] ?? 0 : 0;
  const placedAt = trackingData ? formatDateTime(trackingData.placed_at) : "";
  const trackingSteps = BASE_TRACKING_STEPS.map((step, index) => ({
    ...step,
    date:
      index <= currentStep
        ? placedAt
        : index === currentStep + 1
          ? "Up next"
          : "Pending",
  }));

  const fullAddress = trackingData?.order_address
    ? [
        trackingData.order_address.address,
        trackingData.order_address.thana,
        trackingData.order_address.district,
        trackingData.order_address.division,
        trackingData.order_address.country,
        trackingData.order_address.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : "Address not available";

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28">
      <SEO 
        title="Track Your Order | AmarShop" 
        description="Monitor your AmarShop delivery in real-time. Enter your order ID to see exactly where your items are."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100/50">
            <Truck className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Track Your Order</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Enter your order number or tracking ID to see the status of your luxury delivery.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-luxury border border-gray-100 mb-12">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-6A607A9C90516)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
              />
            </div>
            <button
              disabled={isSearching}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Track Order <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {errorMessage && (
            <p className="mt-4 text-sm font-bold text-red-600">{errorMessage}</p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Progress Tracker */}
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-luxury border border-gray-100">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">Order Tracking</p>
                    <h2 className="text-2xl font-black text-gray-900">ID: {trackingData.order_id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Order Status</p>
                    <p className="text-lg font-black text-gray-900 capitalize">{trackingData.order_status.replace(/_/g, " ")}</p>
                  </div>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 hidden sm:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / (trackingSteps.length - 1)) * 100}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative z-10">
                    {trackingSteps.map((step, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;
                      
                      return (
                        <div key={step.id} className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                            isCompleted ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-white text-gray-300 border-2 border-gray-100 shadow-none"
                          )}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <div className="sm:text-center">
                            <p className={cn(
                              "text-sm font-black uppercase tracking-wider mb-1",
                              isCompleted ? "text-gray-900" : "text-gray-300"
                            )}>
                              {step.label}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400">{step.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Info & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-gray-900">Delivery Address</h3>
                  </div>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{trackingData.order_address?.name || "N/A"}</p>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{trackingData.order_address?.phone || "N/A"}</p>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{fullAddress}</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-gray-900">Shipment Details</h3>
                  </div>
                  <div className="space-y-4">
                    {trackingData.order_items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-gray-900">Product #{item.product_id}</p>
                          <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-black text-gray-900">Tk {formatMoney(item.total ?? Number.parseFloat(item.price) * item.quantity)}</p>
                      </div>
                    ))}

                    <div className="pt-4 mt-2 border-t border-gray-100 space-y-1 text-xs font-bold text-gray-500">
                      <div className="flex justify-between"><span>Subtotal</span><span>Tk {formatMoney(trackingData.subtotal)}</span></div>
                      <div className="flex justify-between"><span>Discount</span><span>- Tk {formatMoney(trackingData.discount_amount)}</span></div>
                      <div className="flex justify-between"><span>Tax</span><span>Tk {formatMoney(trackingData.tax_amount)}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span>Tk {formatMoney(trackingData.shipping_charge)}</span></div>
                      <div className="flex justify-between text-sm text-gray-900 font-black pt-2">
                        <span>Grand Total</span>
                        <span>Tk {formatMoney(trackingData.grand_total)}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="uppercase">Payment</span>
                        <span className="capitalize">{trackingData.payment_method.replace(/_/g, " ")} ({trackingData.payment_status})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}