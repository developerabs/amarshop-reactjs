import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[340px] md:w-[380px] bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="cart-drawer-title" className="text-base font-black text-gray-900 tracking-tight uppercase">Your Cart</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{items.length} Items</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close cart drawer"
                className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 group">
                    <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-emerald-600 transition-colors">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5 border border-gray-100">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-white hover:text-emerald-600 transition-all text-gray-400"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-[10px] font-black text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-6 h-6 flex items-center justify-center rounded-sm hover:bg-white hover:text-emerald-600 transition-all text-gray-400"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <span className="text-xs font-black text-emerald-600">৳{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Your cart is empty</h3>
                    <p className="text-xs text-gray-500">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 uppercase text-[9px] tracking-widest font-black">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Total</span>
                  <span className="text-lg font-black text-emerald-600">৳{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={onCheckout}
                  disabled={items.length === 0}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
              
              <p className="text-[8px] text-center text-gray-400 font-bold uppercase tracking-widest">
                Secure SSL Encrypted
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
