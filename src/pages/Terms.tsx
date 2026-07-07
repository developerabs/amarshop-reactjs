import { useEffect } from "react";
import { FileText, Shield, Truck, RotateCcw, CreditCard } from "lucide-react";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: FileText,
      title: "General Terms",
      content: [
        "By accessing and using AmarShop, you accept and agree to be bound by the terms and provision of this agreement.",
        "These terms apply to all visitors, users, and others who access or use our service.",
        "If you disagree with any part of these terms, you may not access the service."
      ]
    },
    {
      icon: Shield,
      title: "User Accounts",
      content: [
        "You must be at least 18 years old to create an account and use our services.",
        "You are responsible for maintaining the confidentiality of your account and password.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "You must provide accurate and complete information when creating your account."
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "All payments are processed securely through our authorized payment gateways.",
        "Prices are subject to change without notice, but changes will not affect confirmed orders.",
        "Payment must be received in full before order processing begins.",
        "We accept various payment methods including mobile banking and credit cards."
      ]
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      content: [
        "We strive to deliver orders within the estimated timeframe provided at checkout.",
        "Delivery times may vary based on location and product availability.",
        "Risk of loss passes to the buyer upon delivery to the carrier.",
        "Additional charges may apply for expedited shipping or special handling."
      ]
    },
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      content: [
        "Items may be returned within 7 days of delivery for a full refund.",
        "Items must be unused, in original packaging, and with all accessories.",
        "Return shipping costs are the responsibility of the customer unless the item is defective.",
        "Refunds will be processed within 5-7 business days after receipt of returned items."
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using AmarShop
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: May 13, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Introduction</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Welcome to AmarShop. These Terms and Conditions ("Terms", "Terms and Conditions")
              govern your use of our website located at amarshop.com and our mobile application
              (together or individually "Service").
            </p>
            <p>
              Our Service may be used to browse products, place orders, and access various features.
              By using our Service, you agree to be bound by these Terms. If you disagree with any
              part of the terms, then you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-2"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Contact Information</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600">Email: support@amarshop.com</p>
              <p className="text-gray-600">Phone: +880 1234 567890</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Business Inquiries</h3>
              <p className="text-gray-600">Email: business@amarshop.com</p>
              <p className="text-gray-600">Phone: +880 1234 567891</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            These terms and conditions are governed by and construed in accordance with the laws of Bangladesh.
          </p>
        </div>
      </div>
    </main>
  );
}