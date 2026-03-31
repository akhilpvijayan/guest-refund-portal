import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WarningBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] dark:from-amber-900/30 dark:to-yellow-900/20 border-l-[4px] border-l-[#F59E0B] dark:border-l-amber-500 rounded-[16px] p-5 mb-8 shadow-sm flex relative overflow-hidden group border border-amber-100 dark:border-amber-800/40"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDE68A] dark:bg-amber-600/30 blur-[40px] opacity-40 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-110 duration-700" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-[#FEF3C7] dark:bg-amber-950/50 p-2 rounded-full shadow-inner shrink-0 mt-0.5 border border-[#FDE68A] dark:border-amber-800/50">
          <AlertCircle className="w-5 h-5 text-[#D97706] dark:text-amber-500" />
        </div>
        <div>
          <h4 className="font-extrabold text-[#92400E] dark:text-amber-300 text-[15px] mb-1.5 tracking-tight">
            Outside Standard Window
          </h4>
          <p className="text-[#92400E]/80 dark:text-amber-300/80 text-[14px] leading-relaxed font-medium">
            Your booking is older than 90 days. We will review your request on a case-by-case basis and contact you soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
