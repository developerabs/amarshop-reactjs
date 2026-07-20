import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface Settings {
  site_name: string;
  site_title: string;
  site_description: string;
  site_email: string;
  site_phone: string;
  site_address: string;
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

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/settings/general-settings").then((res) => {
      setSettings(res.data.data);
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