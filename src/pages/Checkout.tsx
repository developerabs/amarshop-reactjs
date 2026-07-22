import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, CreditCard, Truck, MapPin, User, Check, 
  ShieldCheck, Zap, Wallet, ChevronRight, Lock, AlertCircle, ChevronDown
} from "lucide-react";
import { useCommerce } from "../context/CommerceContext";
import { useNotifications } from "../context/NotificationContext";
import SEO from "../components/SEO";
import { cn, formatPrice } from "../lib/utils";
import api from "../services/api";
import { v4 as uuidv4 } from "uuid";
import { T } from "@/dist/assets/index-Ch2Iwmre";
import { useSettings } from "../context/SettingsContext";

let guestId: string = localStorage.getItem("guest_id") || '';

if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guest_id", guestId);
}
type Settings = {
  free_shipping_amount?: number;
};

interface CheckoutForm {
  fullname: string;
  phone: string;
  address: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  saveInfo: boolean;
  guest_id: string;
  discountCode?: string;
  shippingId?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCommerce();
  const accessToken = localStorage.getItem("access_token");
  const { addNotification } = useNotifications();
  const [orderConfirmedData, setOrderConfirmedData] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('');
  const { settings } = useSettings() as { settings?: Settings };

  // Calculate product-specific tax and discount with type handling
  const pricing = (() => {
    let totalDiscount = 0;
    let totalTaxAmount = 0;
    let subtotal = 0;
    let freeShippingAmount = settings?.free_shipping_amount || 0;
    
    cartItems.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      // Calculate discount based on discount type
      let itemDiscount = 0;
      if (item.discountType === 'percentage') {
        itemDiscount = itemSubtotal * (item.discountAmount / 100);
      } else if (item.discountType === 'fixed') {
        itemDiscount = item.discountAmount * item.quantity;
      }
      totalDiscount += parseFloat(itemDiscount.toFixed(2));

      // Calculate tax based on tax type
      let itemTax = 0;
      if (item.tax_type === 'inclusive') {
        // Tax is already included in price, extract it
        const subtotalAfterDiscount = itemSubtotal - itemDiscount;
        itemTax = subtotalAfterDiscount * (item.tax_rate / 100) / (1 + item.tax_rate / 100);
      } else {
        // Tax is exclusive, add on top
        const subtotalAfterDiscount = itemSubtotal - itemDiscount;
        itemTax = subtotalAfterDiscount * (item.tax_rate / 100);
      }
      totalTaxAmount += parseFloat(itemTax.toFixed(2));
    });

  
    const selectedShipping = shippingOptions.find(s => s.id == selectedShippingId);
    
    const shippingCost = (selectedShippingId && selectedShipping?.charge) ? parseFloat(parseFloat(selectedShipping.charge).toFixed(2)) : 0;
    
    const grandTotal = parseFloat((subtotal - totalDiscount + totalTaxAmount + shippingCost).toFixed(2));
    const isFreeShipping = subtotal >= freeShippingAmount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalTaxAmount: parseFloat(totalTaxAmount.toFixed(2)),
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      grandTotal,
      isFreeShipping
    };
  })(); // eslint-disable-next-line react-hooks/exhaustive-deps
  // Dependency array: [cartItems, selectedShippingId, shippingOptions]

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutForm>({
    fullname: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    saveInfo: false,
    guest_id: guestId,
    shippingId: selectedShippingId
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
  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        const response = await api.get('/checkout/shipping-charges', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.data.success) {
          setShippingOptions(response.data.data.shipping_charges || []);
        }
      } catch (error) {
        console.error('Failed to fetch shipping options:', error);
      }
    };
    fetchShippingOptions();
  }, [accessToken]);

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        shipping_address: {
          fullname: formData.fullname,
          phone: formData.phone,
          address: formData.address,
        },
        payment_method: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : formData.paymentMethod,
        notes: "",
        products: cartItems.map((item) => ({
          product_id: item.id,
          product_variant_id: item.variationId || null,
          quantity: item.quantity,
        })),
        guest_id: formData.guest_id,
        shipping_id: selectedShippingId || null,
      };

      const response = await api.post('/checkout/place-order', payload , {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("Order submission response:", response);
      setOrderConfirmedData(response.data.data);
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      console.log("Order placed successfully:", response.data);
    } catch (error) {
      setIsProcessing(false);
      addNotification({
          type: "error",
          title: "Order Failed",
          message: (error as any)?.response?.data?.message || "Failed to place order. Please try again."
        });
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
              <span className="text-xs font-black text-gray-900">{orderConfirmedData?.order.order_no ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Delivery</span>
              <span className="text-xs font-black text-gray-900">{orderConfirmedData?.order.est_delivery ?? 'N/A'}</span>
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
    <main className="min-h-screen bg-[#FBFBFB] pb-24 pt-4">
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
                      <Input label="Full Name" value={formData.fullname} onChange={(v) => handleInputChange('fullname', v)} />
                      <Input label="Phone Number" type="number" value={formData.phone} onChange={(v) => handleInputChange('phone', v)} placeholder="+880 1XXX-XXXXXX" />
                      <textarea 
                        className="md:col-span-2 px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium text-gray-900 placeholder-gray-400 resize-none"
                        placeholder="Enter your delivery address"
                        rows={4}
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>

                    {/* Payment Method Section */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-gray-900 tracking-tight">Payment Method</h2>
                          <p className="text-xs text-gray-500 font-medium">Select your preferred payment option.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition-all" onClick={() => handleInputChange('paymentMethod', 'cod')}>
                          <input 
                            type="radio" 
                            name="payment" 
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={() => handleInputChange('paymentMethod', 'cod')}
                            className="w-5 h-5 text-emerald-600 rounded-full cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-black text-gray-900">Cash on Delivery</p>
                            <p className="text-[10px] text-gray-500 font-medium">Pay when your order arrives</p>
                          </div>
                          {formData.paymentMethod === 'cod' && (
                            <Check className="w-5 h-5 text-emerald-600" />
                          )}
                        </label>
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
                
                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-12 pt-10 border-t border-gray-100">
                  <button 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
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
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.variation}</p>
                      <p className="text-xs font-black text-emerald-600">{formatPrice(item.price * item.quantity)}</p>
                      {item.tax_rate > 0 && (
                        <p className="text-[8px] font-bold text-orange-600 uppercase">Tax: {item.tax_rate}% ({item.tax_type || 'inclusive'})</p>
                      )}
                      {item.discountAmount > 0 && (
                        <p className="text-[8px] font-bold text-emerald-600 uppercase">
                          {item.discountType === 'percentage' 
                            ? `Discount: -${item.discountAmount}%` 
                            : `Discount: -${formatPrice(item.discountAmount * item.quantity)}`}
                        </p>
                      )}
                      {(() => {
                        const itemSubtotal = item.price * item.quantity;
                        const itemDiscount = item.discountType === 'percentage' 
                          ? itemSubtotal * (item.discountAmount / 100)
                          : item.discountAmount * item.quantity;
                        
                        let itemTax = 0;
                        let itemTotal = 0;
                        
                        if (item.tax_type === 'inclusive') {
                          // Tax is already included in price
                          itemTax = (itemSubtotal - itemDiscount) * (item.tax_rate / 100) / (1 + item.tax_rate / 100);
                          itemTotal = itemSubtotal - itemDiscount;
                        } else {
                          // Tax is exclusive (added on top)
                          itemTax = (itemSubtotal - itemDiscount) * (item.tax_rate / 100);
                          itemTotal = itemSubtotal - itemDiscount + itemTax;
                        }
                        
                        return (
                          <p className="text-xs font-black text-gray-900 pt-1 border-t border-gray-200">
                            Total: {formatPrice(itemTotal)}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xs font-black text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                
                {pricing.totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</span>
                    <span className="text-xs font-black text-emerald-600">-{formatPrice(pricing.totalDiscount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tax</span>
                  <span className="text-xs font-black text-gray-900">{formatPrice(pricing.totalTaxAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping</span>
                  {pricing.isFreeShipping == false && shippingOptions.length > 0 ? (
                    <select name="shipping" id="shipping" className="text-xs font-black text-gray-900" value={selectedShippingId} onChange={(e) => setSelectedShippingId(e.target.value)}>
                      <option value="">Select shipping option</option>
                      {shippingOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} - {formatPrice(option.charge)}
                        </option>
                      ))}
                    </select>
                  ) : pricing.isFreeShipping ? (
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Free</span>
                  ) : (
                    <span className="text-xs font-black text-gray-900">Calculating...</span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-900">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="text-2xl font-black text-gray-900">{formatPrice(pricing.grandTotal)}</span>
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