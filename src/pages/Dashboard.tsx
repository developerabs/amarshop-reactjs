import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Package, Heart, MapPin, CreditCard, Settings, ShoppingBag, Truck,
  CheckCircle, Clock, XCircle, ChevronRight, LogOut, ShieldCheck, Bell, ExternalLink, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCommerce } from "../context/CommerceContext";
import SEO from "../components/SEO";
import { cn, formatPrice } from "../lib/utils";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/dataService";

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "addresses" | "payments" | "settings">("overview");
  const { wishlist, cartItems, recentViews } = useCommerce();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wishlistProducts = getProducts().filter(p => wishlist.includes(p.id));

  // Mock data for orders
  const recentOrders: Order[] = [
    { id: "AS-982104", date: "May 10, 2026", status: "delivered", total: 12500, items: 3 },
    { id: "AS-982105", date: "May 11, 2026", status: "shipped", total: 8200, items: 1 },
    { id: "AS-982106", date: "May 12, 2026", status: "processing", total: 4500, items: 2 },
  ];

  const getStatusStyles = (status: Order["status"]) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "processing": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "pending": return "bg-gray-50 text-gray-600 border-gray-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-28">
      <SEO title="User Dashboard | AmarShop" description="Manage your orders, wishlist, and account preferences." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-display mb-2">Command Center</h1>
            <p className="text-gray-500 font-medium">Welcome back, <span className="text-gray-900 font-black">John Doe</span>. Here's what's happening with your account.</p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-emerald-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-4xl p-8 shadow-luxury border border-gray-50">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-4xl bg-emerald-100 flex items-center justify-center border-4 border-white shadow-xl">
                    <User className="w-10 h-10 text-emerald-600" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-50 text-gray-400 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-xl font-black text-gray-900">John Doe</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Elite Member</p>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: "overview", label: "Overview", icon: ShieldCheck },
                  { id: "orders", label: "My Orders", icon: Package },
                  { id: "wishlist", label: "Wishlist", icon: Heart },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "payments", label: "Payments", icon: CreditCard },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id
                        ? "bg-gray-900 text-white shadow-xl translate-x-2"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-600")} />
                      <span className="font-black text-xs uppercase tracking-[0.15em]">{item.label}</span>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === item.id ? "opacity-100 translate-x-1" : "opacity-0")} />
                  </button>
                ))}
              </nav>
            </div>

            {/* Promo Card */}
            <div className="bg-emerald-600 rounded-4xl p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Membership Perk</p>
                <h4 className="text-xl font-black leading-tight">Get 10% off your next luxury purchase.</h4>
                <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                  Claim Reward
                </button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {activeTab === "overview" && (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { label: "Active Orders", value: recentOrders.filter(o => o.status !== "delivered").length, icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Total Spent", value: formatPrice(28500), icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Wishlist", value: wishlist.length, icon: Heart, color: "text-red-600", bg: "bg-red-50" },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 shadow-luxury border border-gray-50 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                          </div>
                          <div className={cn("p-4 rounded-2xl", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Tracking */}
                    <div className="bg-white rounded-5xl p-8 sm:p-12 shadow-luxury border border-gray-50">
                      <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
                        <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">View History</button>
                      </div>
                      
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-gray-50 hover:bg-gray-50 transition-all group">
                            <div className="flex items-center gap-6 mb-4 sm:mb-0">
                              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", getStatusStyles(order.status))}>
                                <Package className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-black text-gray-900">Order #{order.id}</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  <span>{order.date}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                  <span>{order.items} Items</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-6">
                              <div className="text-right sm:text-right">
                                <p className="text-lg font-black text-gray-900 tracking-tight">{formatPrice(order.total)}</p>
                                <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border", getStatusStyles(order.status))}>
                                  {order.status}
                                </span>
                              </div>
                              <button 
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="p-3 bg-gray-900 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "orders" && (
                  <div className="bg-white rounded-5xl p-12 shadow-luxury border border-gray-50 text-center space-y-8">
                     <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Package className="w-10 h-10 text-gray-300" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black text-gray-900">Order Archive</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Your past orders and historical transactions will be stored here safely.</p>
                     </div>
                     <button onClick={() => navigate('/products')} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Start Shopping</button>
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black text-gray-900 font-display">My Curations</h2>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{wishlistProducts.length} Saved Items</p>
                    </div>

                    {wishlistProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {wishlistProducts.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-5xl p-20 shadow-luxury border border-gray-50 text-center space-y-6">
                        <Heart className="w-16 h-16 text-red-100 mx-auto fill-red-50" />
                        <h3 className="text-2xl font-black text-gray-900">No curations yet.</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Build your dream collection by saving items you love across our store.</p>
                        <button onClick={() => navigate('/products')} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Explore Store</button>
                      </div>
                    )}
                  </div>
                )}

                {/* More tabs... (Simplified for now but consistent style) */}
                {["addresses", "payments", "settings"].includes(activeTab) && (
                   <div className="bg-white rounded-5xl p-12 shadow-luxury border border-gray-50 min-h-[400px] flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                           {activeTab === 'addresses' && <MapPin className="w-8 h-8 text-gray-300" />}
                           {activeTab === 'payments' && <CreditCard className="w-8 h-8 text-gray-300" />}
                           {activeTab === 'settings' && <Settings className="w-8 h-8 text-gray-300" />}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{activeTab} Section</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto font-medium">This module is part of the high-fidelity enterprise portal and will be unlocked upon backend finalization.</p>
                      </div>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}