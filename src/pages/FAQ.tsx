import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs: FAQ[] = [
    {
      id: "shipping-time",
      question: "How long does shipping take?",
      answer: "We offer same-day delivery in Dhaka for orders placed before 2 PM. For other areas, delivery typically takes 1-3 business days. Express delivery is available for urgent orders.",
      category: "shipping"
    },
    {
      id: "shipping-cost",
      question: "What are the shipping costs?",
      answer: "Free shipping on orders over ৳1000. For orders under ৳1000, shipping costs ৳80 within Dhaka and ৳150 for other areas. Express delivery costs an additional ৳200.",
      category: "shipping"
    },
    {
      id: "returns",
      question: "What is your return policy?",
      answer: "We offer a 7-day easy return policy for most items. Items must be unused, in original packaging, and with all accessories. Return shipping is free for defective items.",
      category: "returns"
    },
    {
      id: "payment-methods",
      question: "What payment methods do you accept?",
      answer: "We accept bKash, Nagad, Rocket, Upay, Visa, Mastercard, and American Express. Cash on delivery is also available for orders within Bangladesh.",
      category: "payment"
    },
    {
      id: "order-tracking",
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via SMS and email. You can also track your order status in your account dashboard under 'My Orders'.",
      category: "orders"
    },
    {
      id: "product-authenticity",
      question: "Are your products authentic?",
      answer: "Yes, all products sold on AmarShop are 100% authentic. We source directly from authorized distributors and manufacturers. Each product comes with genuine warranties and certificates.",
      category: "products"
    },
    {
      id: "size-guide",
      question: "How do I find the right size?",
      answer: "Each product page includes a detailed size guide with measurements. If you're unsure, contact our customer service team for personalized recommendations.",
      category: "products"
    },
    {
      id: "account-creation",
      question: "Do I need to create an account to shop?",
      answer: "While you can browse without an account, creating one allows you to track orders, save addresses, manage wishlists, and enjoy faster checkout. Guest checkout is also available.",
      category: "account"
    },
    {
      id: "password-reset",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. The link is valid for 24 hours.",
      category: "account"
    },
    {
      id: "bulk-orders",
      question: "Do you offer discounts for bulk orders?",
      answer: "Yes, we offer special pricing for bulk orders. Contact our wholesale team at wholesale@amarshop.com for customized quotes and arrangements.",
      category: "business"
    }
  ];

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "returns", label: "Returns & Exchanges" },
    { id: "payment", label: "Payment" },
    { id: "orders", label: "Orders" },
    { id: "products", label: "Products" },
    { id: "account", label: "Account" },
    { id: "business", label: "Business" }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about shopping at AmarShop
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category.id
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleItem(faq.id)}
                aria-expanded={openItems.has(faq.id)}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-all"
              >
                <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openItems.has(faq.id) && (
                <div id={`faq-answer-${faq.id}`} className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Can't find the answer you're looking for? Our customer service team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">
              <Phone className="w-4 h-4" />
              Call Us
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">
              <Mail className="w-4 h-4" />
              Email Us
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}