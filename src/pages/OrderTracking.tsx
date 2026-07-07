import React, { useState, useEffect } from "react";
import { Truck, Search, CheckCircle, Package, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import { cn } from "../lib/utils";

const TRACKING_STEPS = [
  { id: "ordered", label: "Order Placed", date: "May 10, 2026, 02:30 PM", icon: Package },
  { id: "processed", label: "Processing", date: "May 10, 2026, 04:15 PM", icon: Clock },
  { id: "shipped", label: "In Transit", date: "May 11, 2026, 09:00 AM", icon: Truck },
  { id: "delivered", label: "Delivered", date: "Estimated May 13, 2026", icon: CheckCircle },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        id: orderId,
        status: "shipped",
        currentStep: 2,
        estimatedDelivery: "May 13, 2026",
        shippingAddress: "House 24, Road 7, Banani, Dhaka, Bangladesh",
        items: [
          { name: "Traditional Silk Saree", price: 8500, qty: 1 },
          { name: "Gold Plated Bangle Set", price: 4200, qty: 2 }
        ]
      });
      setIsSearching(false);
    }, 1500);
  };

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
                placeholder="Enter Order ID (e.g. TC-123456)"
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
                    <h2 className="text-2xl font-black text-gray-900">ID: {trackingData.id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Estimated Arrival</p>
                    <p className="text-lg font-black text-gray-900">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 hidden sm:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(trackingData.currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative z-10">
                    {TRACKING_STEPS.map((step, i) => {
                      const isCompleted = i <= trackingData.currentStep;
                      const isCurrent = i === trackingData.currentStep;
                      
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
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">
                    {trackingData.shippingAddress}
                  </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-black text-gray-900">Shipment Details</h3>
                  </div>
                  <div className="space-y-4">
                    {trackingData.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-bold text-gray-400">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-black text-gray-900">৳{item.price.toLocaleString()}</p>
                      </div>
                    ))}
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