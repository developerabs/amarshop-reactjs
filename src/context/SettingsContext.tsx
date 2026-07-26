import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface Settings {
  site_name: string;
  site_title: string;
  site_description: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  primary_color?: string;
  secondary_color?: string;
  free_shipping_amount: number;
  copyright_text: string;
  site_logo: string;
  site_favicon: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

const DEFAULT_PRIMARY_COLOR = "#16a34a";
const DEFAULT_SECONDARY_COLOR = "#ffffff";

const normalizeHex = (hex: string | undefined, fallback: string): string => {
  if (!hex) return fallback;
  const value = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [r, g, b] = value.slice(1).split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex, DEFAULT_PRIMARY_COLOR);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  const toHex = (value: number) => clamp(value).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const mixWith = (hex: string, target: { r: number; g: number; b: number }, amount: number) => {
  const base = hexToRgb(hex);
  return rgbToHex({
    r: base.r + (target.r - base.r) * amount,
    g: base.g + (target.g - base.g) * amount,
    b: base.b + (target.b - base.b) * amount,
  });
};

const buildPrimaryScale = (primaryColor: string) => ({
  50: mixWith(primaryColor, { r: 255, g: 255, b: 255 }, 0.92),
  100: mixWith(primaryColor, { r: 255, g: 255, b: 255 }, 0.84),
  200: mixWith(primaryColor, { r: 255, g: 255, b: 255 }, 0.68),
  300: mixWith(primaryColor, { r: 255, g: 255, b: 255 }, 0.5),
  400: mixWith(primaryColor, { r: 255, g: 255, b: 255 }, 0.28),
  500: primaryColor,
  600: mixWith(primaryColor, { r: 0, g: 0, b: 0 }, 0.08),
  700: mixWith(primaryColor, { r: 0, g: 0, b: 0 }, 0.2),
  800: mixWith(primaryColor, { r: 0, g: 0, b: 0 }, 0.32),
  900: mixWith(primaryColor, { r: 0, g: 0, b: 0 }, 0.45),
});

const applyThemeColors = (primaryColor: string | undefined, secondaryColor: string | undefined) => {
  if (typeof document === "undefined") return;

  const primary = normalizeHex(primaryColor, DEFAULT_PRIMARY_COLOR);
  const secondary = normalizeHex(secondaryColor, DEFAULT_SECONDARY_COLOR);
  const primaryScale = buildPrimaryScale(primary);
  const root = document.documentElement;

  root.style.setProperty("--theme-primary", primary);
  root.style.setProperty("--theme-primary-50", primaryScale[50]);
  root.style.setProperty("--theme-primary-100", primaryScale[100]);
  root.style.setProperty("--theme-primary-200", primaryScale[200]);
  root.style.setProperty("--theme-primary-300", primaryScale[300]);
  root.style.setProperty("--theme-primary-400", primaryScale[400]);
  root.style.setProperty("--theme-primary-500", primaryScale[500]);
  root.style.setProperty("--theme-primary-600", primaryScale[600]);
  root.style.setProperty("--theme-primary-700", primaryScale[700]);
  root.style.setProperty("--theme-primary-800", primaryScale[800]);
  root.style.setProperty("--theme-primary-900", primaryScale[900]);
  root.style.setProperty("--theme-secondary", secondary);
};

const applySiteMetadata = (settings: Settings | null) => {
  if (typeof document === "undefined") return;

  const title = settings?.site_title || settings?.site_name || "AmarShop";
  const faviconHref = settings?.site_favicon || "/favicon.svg";

  document.title = title;

  const updateMetaTag = (selector: string, content: string) => {
    const element = document.querySelector<HTMLMetaElement>(selector);
    if (element) {
      element.setAttribute("content", content);
    }
  };

  updateMetaTag('meta[property="og:title"]', title);
  updateMetaTag('meta[name="twitter:title"]', title);

  const faviconLink = document.querySelector<HTMLLinkElement>("link#app-favicon")
    || document.querySelector<HTMLLinkElement>('link[rel="icon"]');

  if (faviconLink) {
    faviconLink.setAttribute("href", faviconHref);
  }
};

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/settings/general-settings")
      .then((res) => {
        const nextSettings: Settings | null = res.data?.data ?? null;
        setSettings(nextSettings);
        applyThemeColors(nextSettings?.primary_color, nextSettings?.secondary_color);
        applySiteMetadata(nextSettings);
      })
      .catch((error) => {
        console.error("Failed to fetch general settings:", error);
        applyThemeColors(DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR);
        applySiteMetadata(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);