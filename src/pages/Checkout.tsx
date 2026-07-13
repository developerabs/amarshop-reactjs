import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, CreditCard, Truck, MapPin, Phone, User, Check, 
  ShieldCheck, Zap, Wallet, ChevronRight, Lock, AlertCircle, ChevronDown
} from "lucide-react";
import { useCommerce } from "../context/CommerceContext";
import { useNotifications } from "../context/NotificationContext";
import SEO from "../components/SEO";
import { cn, formatPrice } from "../lib/utils";
import api from "../services/api";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  saveInfo: boolean;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCommerce();
  const accessToken = localStorage.getItem("access_token");
  const authChecked = accessToken ? true : false;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod',
    saveInfo: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [cartItems, navigate, isSuccess]);

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.address && formData.city && formData.postalCode);
      case 3:
        return !!formData.paymentMethod;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      console.log("Please select a payment method.");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        shipping_address: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          country: "Bangladesh",
          division: formData.city,
          district: formData.city,
          thana: "dhaka",
          address: formData.address,
          postal_code: formData.postalCode,
        },
        payment_method: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : formData.paymentMethod,
        notes: "",
        products: cartItems.map((item) => ({
          product_id: item.id,
          product_variant_id: null,
          quantity: item.quantity,
        })),
      };

      const response = await api.post('/checkout/place-order', payload , {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      console.log("Order placed successfully:", response.data);
    } catch (error) {
      setIsProcessing(false);
      console.error("Order submission error:", error);
    }
  };

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Shipping', icon: MapPin },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Review', icon: Check },
  ];

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"
            >
              <Check className="w-12 h-12 stroke-[3]" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-emerald-400 rounded-full -z-10" 
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-display">Order Confirmed!</h1>
            <p className="text-gray-500 font-medium">Your artifacts are being prepared for shipment. A confirmation email has been sent to your inbox.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
              <span className="text-xs font-black text-gray-900">AS-982107</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Delivery</span>
              <span className="text-xs font-black text-gray-900">May 15 - May 17, 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl transition-all active:scale-95"
            >
              Track Order In Dashboard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Back to Storefront
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-28">
      <SEO title="Checkout | AmarShop" description="Complete your purchase with secure checkout." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Bag
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-display">Secure <span className="text-emerald-600">Checkout</span></h1>
            <p className="text-sm text-gray-500 font-medium">Finalize your selection and we'll handle the rest.</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500",
                  currentStep >= step.number ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-50 text-gray-400"
                )}>
                  {currentStep > step.number ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-4 h-1 mx-1 rounded-full bg-gray-50">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-700 bg-emerald-600",
                      currentStep > step.number ? "w-full" : "w-0"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2.5rem] shadow-luxury border border-gray-100 p-8 sm:p-12"
              >
                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Identity Details</h2>
                        <p className="text-xs text-gray-500 font-medium">Please provide your contact information.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="First Name" value={formData.firstName} onChange={(v) => handleInputChange('firstName', v)} />
                      <Input label="Last Name" value={formData.lastName} onChange={(v) => handleInputChange('lastName', v)} />
                      <Input label="Email Address" type="email" value={formData.email} onChange={(v) => handleInputChange('email', v)} />
                      <Input label="Phone Number" type="tel" value={formData.phone} onChange={(v) => handleInputChange('phone', v)} placeholder="+880 1XXX-XXXXXX" />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Delivery Hub</h2>
                        <p className="text-xs text-gray-500 font-medium">Where should we ship your artifacts?</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <Input label="Full Street Address" value={formData.address} onChange={(v) => handleInputChange('address', v)} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="City / Region" value={formData.city} onChange={(v) => handleInputChange('city', v)} />
                        <Input label="Postal Code" value={formData.postalCode} onChange={(v) => handleInputChange('postalCode', v)} />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Payment Gateway</h2>
                        <p className="text-xs text-gray-500 font-medium">Select your preferred secure payment method.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at Door', icon: Truck },
                        { id: 'bkash', label: 'bKash', sub: 'Fast & Secure', icon: Phone },
                        { id: 'nagad', label: 'Nagad', sub: 'Mobile Wallet', icon: Wallet },
                        { id: 'card', label: 'Credit Card', sub: 'Visa / MC', icon: CreditCard },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handleInputChange('paymentMethod', method.id as any)}
                          className={cn(
                            "flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left",
                            formData.paymentMethod === method.id 
                              ? "border-emerald-600 bg-emerald-50/50 shadow-luxury ring-4 ring-emerald-500/10" 
                              : "border-gray-100 bg-white hover:border-emerald-200"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                            formData.paymentMethod === method.id ? "bg-emerald-600 text-white" : "bg-gray-50 text-gray-400"
                          )}>
                            <method.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{method.label}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{method.sub}</p>
                          </div>
                          {formData.paymentMethod === method.id && (
                            <div className="ml-auto w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white stroke-[4]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4"
                      >
                        <Input label="Card Number" placeholder="0000 0000 0000 0000" onChange={() => {}} />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Expiry Date" placeholder="MM/YY" onChange={() => {}} />
                          <Input label="CVV" placeholder="***" type="password" onChange={() => {}} />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Lock className="w-3 h-3" />
                          Encrypted 256-bit Secure Payment
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Final Review</h2>
                        <p className="text-xs text-gray-500 font-medium">Verify your details before placing the order.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping To</p>
                        <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 space-y-1">
                          <p className="text-sm font-black text-gray-900">{formData.firstName} {formData.lastName}</p>
                          <p className="text-xs text-gray-500 font-medium">{formData.address}</p>
                          <p className="text-xs text-gray-500 font-medium">{formData.city}, {formData.postalCode}</p>
                          <p className="text-xs text-gray-500 font-medium">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment via</p>
                        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-black text-emerald-900 uppercase tracking-widest">{formData.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded-lg text-emerald-600 focus:ring-emerald-500/20" />
                        <span className="text-xs text-gray-500 font-medium leading-relaxed">
                          I agree to AmarShop's <a href="/terms" className="text-emerald-600 font-black underline">Terms of Service</a> and confirm that the shipping details provided are accurate for prompt delivery.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-12 pt-10 border-t border-gray-100">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1 || isProcessing}
                    className="flex items-center gap-2 px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors disabled:opacity-0"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    Previous Step
                  </button>

                  <button 
                    onClick={currentStep === 4 ? handleSubmit : nextStep}
                    disabled={isProcessing}
                    className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Authorizing...
                      </>
                    ) : (
                      <>
                        {currentStep === 4 ? "Authorize Payment" : "Continue Checkout"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale pointer-events-none">
              <ShieldCheck className="w-12 h-12" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-8" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-luxury border border-gray-100 p-8 sticky top-32 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-emerald-400" />
              
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center justify-between">
                Order Value
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">({cartItems.length} Items)</span>
              </h3>

              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                      <p className="text-xs font-black text-emerald-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xs font-black text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Fee</span>
                  <span className="text-xs font-black text-emerald-600">{cartTotal >= 1000 ? "FREE" : formatPrice(80)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-900">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">{formatPrice(cartTotal + (cartTotal >= 1000 ? 0 : 80))}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-emerald-50 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tighter">
                  Your order qualifies for <span className="font-black underline">Priority Processing</span> and Secure Fulfillment across all zones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string, value?: string, onChange: (v: string) => void, type?: string, placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-sm text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-emerald-600 outline-none transition-all shadow-inner"
      />
    </div>
  );
}