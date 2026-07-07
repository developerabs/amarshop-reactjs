import { Mail, ArrowRight, BellRing, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function Newsletter() {
  return (
    <section className="py-12 sm:py-24 bg-gray-900 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/20 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-600/10 rounded-full blur-[60px] sm:blur-[100px]" />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 p-6 sm:p-16 md:p-24 overflow-hidden relative">
          {/* Decorative Icon */}
          <div className="absolute -top-10 -right-10 opacity-10 rotate-12 pointer-events-none">
            <BellRing className="w-48 h-48 sm:w-64 sm:h-64 text-white" />
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Join the AmarShop Club
            </motion.div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
              Unlock <span className="text-emerald-500">Exclusive</span> Access
            </h2>
            
            <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium leading-relaxed px-2">
              Be the first to know about new collections, seasonal sales, and exclusive events in Bangladesh.
            </p>

            <form className="max-w-lg mx-auto space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 sm:py-5 pl-14 pr-4 text-white font-bold placeholder:text-gray-500 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/20 focus:border-emerald-500/50 outline-none transition-all text-sm sm:text-base"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 sm:py-5 pl-14 pr-4 text-white font-bold placeholder:text-gray-500 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white/20 focus:border-emerald-500/50 outline-none transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              <button className="w-full bg-emerald-600 text-white py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base hover:bg-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                Join Now <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-2 sm:pt-4">
              <div className="text-center">
                <p className="text-white font-black text-xl sm:text-2xl">50k+</p>
                <p className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Subscribers</p>
              </div>
              <div className="w-[1px] h-6 sm:h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white font-black text-xl sm:text-2xl">10%</p>
                <p className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">First Order Off</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

