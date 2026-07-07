import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useCommerce } from "../context/CommerceContext";

export default function BottomNav({ onCartClick, onWishlistClick, onProfileClick }: { onCartClick?: () => void, onWishlistClick?: () => void, onProfileClick?: () => void }) {
  const { cartCount, wishlistCount } = useCommerce();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", active: location.pathname === "/", onClick: () => navigate("/") },
    { icon: Grid, label: "All Products", active: location.pathname === "/allproducts", onClick: () => navigate("/allproducts") },
    { icon: ShoppingCart, label: "Cart", badge: cartCount > 0 ? cartCount : undefined, onClick: onCartClick },
    { icon: Heart, label: "Wishlist", badge: wishlistCount > 0 ? wishlistCount : undefined, onClick: onWishlistClick },
    { icon: User, label: "Profile", onClick: onProfileClick },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors relative",
              item.active ? "text-emerald-600" : "text-gray-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
