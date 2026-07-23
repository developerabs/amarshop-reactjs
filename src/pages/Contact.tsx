import { useEffect, useState, type FormEvent } from "react";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

interface Settings {
  site_email?: string;
  site_phone?: string;
  site_address?: string;
}

export default function Contact() {
  const { settings } = useSettings() as { settings?: Settings };
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    api.post("/contact/submit", formState)
      .then((response) => {
        console.log("Contact form submitted successfully:", response);
        setStatus("success");
        setFormState({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => {
          setStatus("idle");
        }, 5000); // Reset status after 5 seconds
      })
      .catch((error) => {
        console.error("Error submitting contact form:", error);
        setStatus("error");
      });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10 sm:p-12">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Contact Us</h1>
              <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl">
                Have a question about products, orders, or partnerships? Send us a message and our support team will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-bold text-gray-700">
                    Name*
                    <input
                      value={formState.name}
                      onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-bold text-gray-700">
                    Email*
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-bold text-gray-700 block">
                  Phone
                  <input
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    // optional
                    className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </label>

                <label className="space-y-2 text-sm font-bold text-gray-700 block">
                  Message*
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    required
                    className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition-all"
                >
                  Send Message
                </button>

                {status === "success" && (
                  <p className="text-sm font-black text-emerald-700">Your message has been sent successfully.</p>
                )}
              </form>
            </div>

            <div className="p-10 sm:p-12 bg-emerald-600 text-white">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.2em]">Need immediate help?</h2>
                  <p className="mt-2 text-sm leading-7 text-emerald-100">Reach out to our support team for orders, shipping, returns, and wholesale inquiries.</p>
                </div>

                <div className="space-y-4">
                  {settings?.site_email && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Customer Support</p>
                    <p className="mt-2 font-black text-lg">{settings?.site_email}</p>
                  </div>
                  )}
                  {settings?.site_phone && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Phone</p>
                    <p className="mt-2 font-black text-lg">{settings?.site_phone}</p>
                  </div>
                  )}
                  {settings?.site_address && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Address</p>
                    <p className="mt-2 font-black text-lg">{settings?.site_address}</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

