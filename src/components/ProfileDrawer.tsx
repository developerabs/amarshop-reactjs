import { X, User, Settings, Package, Heart, LogOut, ChevronRight, Bell, Shield, CreditCard, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import api from "../services/api";
import { useState, useEffect } from "react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const authChecked = accessToken ? true : false;
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("access_token");
      onClose();
      setTimeout(() => {
          window.location.href = "/";
      });
    }
  }
  const [userInfo, setUserInfo] = useState<any>(null);
  const user = {
    name: userInfo?.name,
    email: userInfo?.email,
    avatar: userInfo?.avatar,
    phone: userInfo?.phone,
    memberSince: userInfo?.memberSince
  };

  const menuItems = [
    { icon: Package, label: "My Orders", count: 5, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Heart, label: "My Wishlist", count: 12, color: "text-pink-600", bg: "bg-pink-50" },
    { icon: Bell, label: "Notifications", count: 3, color: "text-orange-600", bg: "bg-orange-50" },
    { icon: CreditCard, label: "Payment Methods", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: MapPin, label: "Shipping Address", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Shield, label: "Privacy & Security", color: "text-gray-600", bg: "bg-gray-100" },
    { icon: Settings, label: "Account Settings", color: "text-gray-600", bg: "bg-gray-100" },
  ];
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.data.success) {
          console.log("User Info:", response.data.data.user);
          setUserInfo(response.data.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (authChecked) {
      fetchUserInfo();
    }
  }, [authChecked]);


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-drawer-title"
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[340px] md:w-[380px] bg-white z-[120] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 tracking-tight uppercase">My Profile</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account Overview</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close profile drawer"
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Section */}
            <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full p-1 bg-white shadow-xl border border-gray-100 mb-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <button
                  type="button"
                  aria-label="Edit profile settings"
                  className="absolute bottom-3 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-emerald-700 transition-all"
                >
                    <Settings className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="text-base font-black text-gray-900 tracking-tight uppercase">{user.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user.email}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-900">12</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                  </div>
                  <div className="w-[1px] h-4 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-900">৳4.5k</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Spent</p>
                  </div>
                  <div className="w-[1px] h-4 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xs font-black text-gray-900">250</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  aria-label={item.label}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", item.bg, item.color)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black text-gray-700 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{item.label}</p>
                      {item.count !== undefined && (
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.count} Active Items</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-white border border-red-100 text-red-600 font-black text-[10px] shadow-sm hover:bg-red-50 active:scale-95 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group">
                <LogOut className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                Logout Account
              </button>
              <p className="mt-3 text-[8px] font-bold text-gray-400 text-center uppercase tracking-widest">
                Member Since {user.memberSince}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
