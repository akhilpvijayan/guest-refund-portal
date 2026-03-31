'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { File as FileIcon, Download, RefreshCw } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import type { UploadedFile } from '@/types';

interface ConfirmationData {
  fullName: string;
  email: string;
  bookingRef: string;
  bookingDate: string;
  refundReason: string;
  additionalDetails?: string;
  refId: string;
  fileUrls: UploadedFile[];
}

interface ConfirmationSummaryProps {
  initialData?: ConfirmationData | null;
  onReset?: () => void;
}

export default function ConfirmationSummary({ initialData, onReset }: ConfirmationSummaryProps) {
  const router = useRouter();
  const [data, setData] = useState<ConfirmationData | null>(initialData || null);

  useEffect(() => {
    // Fallback just in case they land here without route params but with strict sessionStorage setup
    if (!initialData) {
      const sessionData = sessionStorage.getItem('refund_submission_data');
      if (sessionData) {
        setData(JSON.parse(sessionData));
        sessionStorage.removeItem('refund_submission_data');
      } else {
        router.push('/');
      }
    }
  }, [router, initialData]);

  if (!data) return null;

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0 } }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto bg-white/60 md:bg-white/80 dark:bg-slate-900/60 dark:md:bg-slate-900/80 backdrop-blur-2xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] md:border border-white/50 dark:border-slate-700/50 relative overflow-hidden">
      {/* Glossy top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-500/50 to-transparent opacity-60 pointer-events-none" />

      <div className="p-8 md:p-10 relative z-10">
        
        {/* Animated Checkmark Header */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100 dark:border-slate-800">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[72px] h-[72px] rounded-full bg-emerald-50 dark:bg-emerald-900/30 shadow-inner flex items-center justify-center mb-5 relative"
          >
            <motion.svg className="w-9 h-9 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                d="M20 6L9 17l-5-5" 
              />
            </motion.svg>
          </motion.div>
          
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[28px] font-extrabold text-[#0F172A] dark:text-white mb-2 tracking-tight">
            Saved & Retrieved
          </motion.h2>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-500 dark:text-slate-400 mb-6 text-[15px]">
            We've verified your request exists securely in the database!
          </motion.p>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-tr from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-mono text-[15px] tracking-wider font-bold shadow-[0_2px_10px_-3px_rgba(79,70,229,0.2)] dark:shadow-none border border-indigo-100 dark:border-indigo-800 uppercase"
          >
            {data.refId || '#REF-PENDING'}
          </motion.div>
        </div>

        {/* Summary Details */}
        <div className="py-8">
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-5">
            Confirmed Database Entry
          </motion.h3>
          
          <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={itemVars}><DetailRow label="Full Name" value={data.fullName} /></motion.div>
            <motion.div variants={itemVars}><DetailRow label="Email Address" value={data.email} /></motion.div>
            <motion.div variants={itemVars}><DetailRow label="Booking Ref" value={data.bookingRef} /></motion.div>
            <motion.div variants={itemVars}><DetailRow label="Booking Date" value={data.bookingDate} /></motion.div>
            <motion.div variants={itemVars}><DetailRow label="Refund Reason" value={data.refundReason} /></motion.div>
            
            {data.additionalDetails && (
              <motion.div variants={itemVars}><DetailRow label="Details" value={data.additionalDetails} /></motion.div>
            )}

            {data.fileUrls && data.fileUrls.length > 0 && (
              <motion.div variants={itemVars} className="pt-3">
                <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-3">
                  Database Files
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.fileUrls.map((file: UploadedFile, idx: number) => (
                    <motion.a
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      key={idx} href={file.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-700 rounded-xl group transition-all"
                    >
                      <div className="bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors shrink-0">
                        <FileIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                      </div>
                      <span className="truncate flex-1 max-w-full text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-3">
                        {file.name}
                      </span>
                      <Download className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400 shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="pt-2">
          <motion.button
            variants={itemVars}
            onClick={() => {
              if (onReset) {
                onReset();
              } else {
                router.push('/');
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-6 rounded-xl text-[15px] font-bold text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-white shadow-lg shadow-slate-900/20 dark:shadow-slate-50/20 transition-all focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-600"
          >
            Submit Another Request
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 border-b border-slate-50/80 dark:border-slate-800/80 last:border-0 grow">
      <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mb-1 sm:mb-0 w-1/3 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800 dark:text-slate-200 font-semibold sm:text-right w-full sm:w-2/3 break-words">
        {value}
      </span>
    </div>
  );
}
