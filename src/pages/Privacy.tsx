import { useEffect } from "react";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone, address)",
        "Payment information processed securely through our payment partners",
        "Order history and shopping preferences",
        "Device information and browsing data for improving our service",
        "Communication records when you contact our customer service"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Provide customer support and respond to inquiries",
        "Send order confirmations, shipping updates, and important notifications",
        "Improve our website and services based on usage patterns",
        "Prevent fraud and maintain platform security",
        "Comply with legal obligations and resolve disputes"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We use industry-standard encryption for all data transmission",
        "Payment information is never stored on our servers",
        "Access to personal data is restricted to authorized personnel only",
        "Regular security audits and updates to protect your information",
        "We comply with Bangladesh's data protection regulations"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell or rent your personal information to third parties",
        "Information may be shared with payment processors and shipping partners",
        "Legal requirements may necessitate sharing information with authorities",
        "Aggregated, non-personal data may be used for analytics and reporting",
        "Service providers assisting our operations may access necessary data"
      ]
    },
    {
      icon: Mail,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request correction of inaccurate data",
        "Request deletion of your personal information",
        "Opt-out of marketing communications",
        "Data portability for your information",
        "Lodge complaints regarding data handling"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: May 13, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Our Commitment to Privacy</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              At AmarShop, we are committed to protecting your privacy and ensuring the security
              of your personal information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website and services.
            </p>
            <p>
              We believe in transparency and have designed our practices to give you control
              over your personal information. By using our services, you agree to the collection
              and use of information in accordance with this policy.
            </p>
            <p>
              This policy applies to all users of AmarShop's website, mobile application,
              and related services.
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
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

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Cookies and Tracking</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience,
              analyze site traffic, and personalize content. Cookies help us remember your preferences
              and improve our services.
            </p>
            <p>
              You can control cookie settings through your browser preferences. However, disabling
              cookies may affect the functionality of our website.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <h3 className="font-bold text-gray-900 mb-2">Types of Cookies We Use:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Contact Us About Privacy</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Privacy Officer</h3>
              <p className="text-gray-600">Email: privacy@amarshop.com</p>
              <p className="text-gray-600">Phone: +880 1234 567890</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Data Protection</h3>
              <p className="text-gray-600">Email: dpo@amarshop.com</p>
              <p className="text-gray-600">Address: Dhanmondi, Dhaka-1205, Bangladesh</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
            <p className="text-sm text-emerald-800">
              <strong>Data Subject Rights:</strong> You have the right to access, correct, delete,
              or restrict processing of your personal data. Contact us to exercise these rights.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This privacy policy is compliant with Bangladesh's data protection laws and international standards.
          </p>
        </div>
      </div>
    </main>
  );
}