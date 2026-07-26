import { useEffect, useMemo, useState } from "react";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, Headphones, Globe, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

interface FooterMenuItem {
  id: number;
  title: string;
  url: string;
  position: number;
}

interface FooterMenuApiResponse {
  success: boolean;
  data?: {
    menus?: Array<{
      items?: FooterMenuItem[];
    }>;
  };
}

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLinkItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  sort_order: number;
}

interface SocialLinksApiResponse {
  success?: boolean;
  data?: {
    social_links?: SocialLinkItem[];
  };
}

const FALLBACK_FOOTER_LINKS = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Cookies", href: "/privacy" },
];

const FALLBACK_COMPANY_LINKS: FooterLink[] = [
  { name: "Our Story", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Press Office", href: "#" },
  { name: "Sustainability", href: "#" },
];

export default function Footer() {
  const { settings } = useSettings();
  const [footerMenuItems, setFooterMenuItems] = useState<FooterMenuItem[]>([]);
  const [companyMenuItems, setCompanyMenuItems] = useState<FooterMenuItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);

  useEffect(() => {
    const loadFooterMenus = async () => {
      try {
        const response = await api.get<FooterMenuApiResponse>("/menus/location/footer-menu");
        const items = response.data?.data?.menus?.[0]?.items ?? [];
        setFooterMenuItems([...items].sort((a, b) => a.position - b.position));
      } catch (error) {
        console.error("Failed to fetch footer menus:", error);
      }
    };

    loadFooterMenus();
  }, []);

  useEffect(() => {
    const loadCompanyMenus = async () => {
      try {
        const response = await api.get<FooterMenuApiResponse>("/menus/location/company-menu");
        const items = response.data?.data?.menus?.[0]?.items ?? [];
        setCompanyMenuItems([...items].sort((a, b) => a.position - b.position));
      } catch (error) {
        console.error("Failed to fetch company menus:", error);
      }
    };

    loadCompanyMenus();
  }, []);

  useEffect(() => {
    const loadSocialLinks = async () => {
      const endpoints = ["/social-links", "/social/links", "/settings/social-links"];

      try {
        let loadedSocialLinks: SocialLinkItem[] = [];

        for (const endpoint of endpoints) {
          try {
            const response = await api.get<SocialLinksApiResponse>(endpoint);
            loadedSocialLinks = response.data?.data?.social_links ?? [];
            if (loadedSocialLinks.length > 0) {
              break;
            }
          } catch {
            // Try next endpoint variant.
          }
        }

        setSocialLinks([...loadedSocialLinks].sort((a, b) => a.sort_order - b.sort_order));
      } catch (error) {
        console.error("Failed to fetch social links:", error);
        setSocialLinks([]);
      }
    };

    loadSocialLinks();
  }, []);

  const footerLinks = useMemo(() => {
    if (!footerMenuItems.length) {
      return FALLBACK_FOOTER_LINKS;
    }

    return footerMenuItems.map((item) => ({
      name: item.title,
      href: item.url || "#",
    }));
  }, [footerMenuItems]);

  const companyLinks = useMemo(() => {
    if (!companyMenuItems.length) {
      return FALLBACK_COMPANY_LINKS;
    }

    return companyMenuItems.map((item) => ({
      name: item.title,
      href: item.url || "#",
    }));
  }, [companyMenuItems]);

  const features = [
    { icon: Truck, title: "Fast Delivery", desc: "Across Bangladesh" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% Protected" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-Day Window" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated Team" },
  ];

  const getSocialIcon = (iconValue: string, nameValue: string): LucideIcon => {
    const value = `${iconValue} ${nameValue}`.toLowerCase();
    if (value.includes("facebook")) return Facebook;
    if (value.includes("instagram")) return Instagram;
    if (value.includes("twitter") || value.includes("x.com") || value.includes("x ")) return Twitter;
    if (value.includes("youtube")) return Youtube;
    return Globe;
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-[33px] pl-0 pb-[80px] mb-[2px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-[15px] pb-[21px] border-b border-gray-100">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-sm">{f.title}</h5>
                <p className="text-xs text-gray-500 font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            {settings?.site_logo && (
              <img src={settings?.site_logo ?? ''} alt={settings?.site_name ?? ''} className="h-8 sm:h-12 site-logo-header" />
            )}
            {settings?.site_description && (
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {settings?.site_description}
              </p>
            )}
            <div className="flex gap-3">
              {(socialLinks.length ? socialLinks : [
                { id: 1, name: "Facebook", url: "#", icon: "facebook", sort_order: 1 },
                { id: 2, name: "Instagram", url: "#", icon: "instagram", sort_order: 2 },
                { id: 3, name: "Twitter", url: "#", icon: "twitter", sort_order: 3 },
                { id: 4, name: "YouTube", url: "#", icon: "youtube", sort_order: 4 },
              ]).map((social) => {
                const Icon = getSocialIcon(social.icon, social.name);
                return (
                  <a
                    key={social.id}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold">
              {companyLinks.map((link, index) => (
                <li key={`${link.name}-${index}`}>
                  <Link to={link.href} className="text-gray-500 hover:text-emerald-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold">
              {settings?.site_address && (
                <li className="flex items-start gap-3 text-gray-500">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{settings?.site_address}</span>
                </li>
              )}
              {settings?.site_phone && (
                <li className="flex items-center gap-3 text-gray-500">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{settings?.site_phone}</span>
                </li>
              )}
              {settings?.site_email && (
                <li className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{settings?.site_email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-gray-900 font-black text-sm uppercase tracking-widest mb-8">Payments</h4>
            <div className="grid grid-cols-3 gap-2">
              {['bKash', 'Nagad', 'Visa', 'MC', 'Rocket', 'Upay'].map((p) => (
                <div key={p} className="h-10 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-default border border-gray-100">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>{settings?.copyright_text}</p>
          <div className="flex gap-6">
            {footerLinks.map((link, index) => (
              <Link
                key={`${link.name}-${index}`}
                to={link.href}
                className="hover:text-emerald-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

