import { useEffect, useMemo, useState } from "react";
import { Mail, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

  // const FALLBACK_NAV_LINKS = [
  //   { name: "Home", href: "/" },
  //   { name: "Flash Deal", href: "/flash-deal" },
  //   { name: "All Products", href: "/allproducts" },
  //   { name: "Seller Shop", href: "/seller-shop" },
  //   { name: "Compare", href: "/compare" },
  //   { name: "Blogs", href: "/blogs" },
  //   { name: "Contact Us", href: "/contact" },
  // ];

interface MenuItem {
  id: number;
  title: string;
  url: string;
  position: number;
}

interface MenuApiResponse {
  success: boolean;
  data?: {
    menus?: Array<{
      items?: MenuItem[];
    }>;
  };
}

export default function SubNavbar({ onCategoriesClick }: { onCategoriesClick?: () => void }) {
  const { settings } = useSettings();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await api.get<MenuApiResponse>("/menus/location/main-navigation");
        const items = response.data?.data?.menus?.[0]?.items ?? [];
        setMenuItems([...items].sort((a, b) => a.position - b.position));
      } catch (error) {
        console.error("Failed to fetch main navigation menus:", error);
      }
    };

    loadMenus();
  }, []);

  const navLinks = useMemo(() => {
    if (!menuItems.length) {
      return [];
    }

    return menuItems.map((item) => ({
      name: item.title,
      href: item.url || "#",
    }));
  }, [menuItems]);

  return (
    <div className="hidden md:block bg-white border-b border-gray-100 sticky top-[80px] z-40 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12">
          
          {/* Left: All Categories Button */}
          <div className="w-64 flex-shrink-0">
            <button
              onClick={onCategoriesClick}
              className="flex items-center gap-3 px-6 h-12 w-full font-black text-[11px] uppercase tracking-widest transition-all bg-[#0056b3] text-white hover:bg-[#004494]"
            >
              <Menu className="w-4 h-4" />
              ALL CATEGORIES
            </button>
          </div>

          {/* Center: Page Navigation Bar */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1 px-4 lg:px-8 overflow-x-auto no-scrollbar">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.name}-${index}`}
                to={link.href}
                className="text-[10px] lg:text-[11px] font-bold text-gray-700 uppercase tracking-wider hover:text-[#0056b3] transition-colors whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Email Info */}
          {settings?.site_email && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{settings?.site_email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


