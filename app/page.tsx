'use client';

import RefundForm from '@/components/RefundForm';
import { ShieldCheck, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const details = [
    { icon: Clock, title: "24/7 Processing", desc: "Automated systems handle your request instantly." },
    { icon: CreditCard, title: "Direct to Source", desc: "Refunds return to your original payment method in 3-5 days." },
    { icon: ShieldCheck, title: "Secure Data", desc: "Your booking and payment details are encrypted." }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-white to-[#FAFAFA] dark:bg-[#0A0F1C] font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/15 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-300/15 dark:bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-normal" />

      <div className="max-w-[1240px] mx-auto px-6 lg:px-12 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 min-h-screen">
        
        {/* Left Content */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-white/80 backdrop-blur-sm dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              Hassle-free <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Refund Portal</span>
            </h1>

            <p className="text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[480px]">
              We know plans change. Submit your booking details below and our team will process your refund following our standard cancellation policy.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 space-y-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          >
            {details.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[14px] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Warning Note */}
          <motion.div 
            className="mt-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/50 rounded-2xl flex gap-3 items-start max-w-[480px]"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-800 dark:text-amber-200 leading-relaxed">
              Standard requests are reviewed within 48 hours. If your flight departs within 24 hours, please contact our emergency hotline instead.
            </p>
          </motion.div>
        </div>

        {/* Right Content - Form Component */}
        <div className="w-full lg:w-[50%] flex justify-center lg:justify-end">
          <motion.div 
            className="w-full relative"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Form Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-emerald-400/20 dark:from-blue-600/20 dark:to-emerald-600/20 blur-3xl transform -translate-y-4 -z-10 rounded-[40px]" />
            <RefundForm />
          </motion.div>
        </div>

      </div>
    </main>
  );
}
