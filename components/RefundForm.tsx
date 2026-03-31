'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ChevronDown, X, Loader2, File, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import WarningBanner from './WarningBanner';
import ConfirmationSummary from './ConfirmationSummary';

export default function RefundForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bookingRef: '',
    bookingDate: '',
    refundReason: '',
    additionalDetails: ''
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submittedData, setSubmittedData] = useState<any>(null);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Required';
        break;
      case 'email':
        if (!value.trim()) error = 'Required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email';
        break;
      case 'bookingRef':
        if (!value.trim()) error = 'Required';
        break;
      case 'bookingDate':
        if (!value) error = 'Required';
        break;
      case 'refundReason':
        if (!value) error = 'Required reason';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const isOutsideRefundWindow = (dateStr: string) => {
    if (!dateStr) return false;
    const bookingDate = new Date(dateStr);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return bookingDate < ninetyDaysAgo;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); void e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles.filter(f => f.size <= 10 * 1024 * 1024)]);
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const fieldValid = validateField(key, formData[key as keyof typeof formData]);
      if (['fullName', 'email', 'bookingRef', 'bookingDate', 'refundReason'].includes(key) && !fieldValid) {
        isValid = false;
        newErrors[key] = errors[key] || 'Required field';
      }
    });

    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      files.forEach(f => data.append('files', f));

      const response = await fetch(`/api/submit-refund?t=${Date.now()}`, { method: 'POST', body: data });
      const result = await response.json();

      if (result.success) {
        setSubmittedData({
          ...formData, refId: result.refId, fileUrls: result.fileUrls
        });
      } else {
        alert(result.error || 'Failed to submit request');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const showWarning = isOutsideRefundWindow(formData.bookingDate);

  // Animation Variants
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0, duration: 0.6 } }
  };

  if (submittedData) {
    return (
      <div suppressHydrationWarning className="w-full max-w-[560px] mx-auto animate-in fade-in duration-500">
        <ConfirmationSummary initialData={submittedData} onReset={() => setSubmittedData(null)} />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="w-full max-w-[560px] mx-auto bg-white/70 md:bg-white/80 dark:bg-slate-900/60 dark:md:bg-slate-900/80 backdrop-blur-[32px] rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] md:border border-white/60 dark:border-slate-700/50 relative overflow-hidden transition-all duration-500">
      
      {/* Glossy top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/50 to-transparent opacity-60 pointer-events-none" />

      <div className="p-6 md:p-10 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-gradient-to-b from-[#F8FAFC] to-slate-50 dark:from-blue-900/40 dark:to-indigo-900/20 text-slate-600 dark:text-blue-400 rounded-full text-xs font-bold tracking-wide mb-5 border border-slate-200/60 dark:border-blue-800 shadow-sm select-none">
            Refund Application
          </div>
          <h2 className="text-[28px] xs:text-[32px] md:text-4xl font-extrabold text-[#0F172A] dark:text-white mb-3 tracking-tight">Request a Refund</h2>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Fields marked with <span className="text-red-500/90 font-bold">*</span> are required
          </p>
        </motion.div>

        <AnimatePresence>
          {errorCount > 0 && Object.values(touched).length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="overflow-hidden mb-6"
            >
              <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/50 backdrop-blur-md text-red-600 dark:text-red-400 rounded-xl p-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
                <AlertCircle className="w-4 h-4" /> Please fix {errorCount} issues before proceeding
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form variants={containerVars} initial="hidden" animate="show" onSubmit={handleSubmit} className="space-y-7">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVars}>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase" htmlFor="fullName">Full Name <span className="text-red-500">*</span></label>
              <div className="relative group">
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="John Doe"
                  className={`w-full rounded-xl px-4 py-3 text-[15px] text-slate-800 dark:text-white bg-white/60 dark:bg-slate-900/50 transition-all duration-300 outline-none hover:bg-white dark:hover:bg-slate-800 shadow-sm
                    ${errors.fullName && touched.fullName ? 'border-[1.5px] border-red-400 focus:border-red-500 bg-red-50/30' : 
                      touched.fullName && !errors.fullName ? 'border-[1.5px] border-emerald-400 focus:border-emerald-500' : 'border border-slate-200/60 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
                  }`} />
              </div>
              <AnimatePresence>{errors.fullName && touched.fullName && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-[13px] text-red-500 font-medium">{errors.fullName}</motion.p>}</AnimatePresence>
            </motion.div>

            <motion.div variants={itemVars}>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase" htmlFor="email">Email <span className="text-red-500">*</span></label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="john@example.com"
                className={`w-full rounded-xl px-4 py-3 text-[15px] text-slate-800 dark:text-white bg-white/60 dark:bg-slate-900/50 transition-all duration-300 outline-none hover:bg-white dark:hover:bg-slate-800 shadow-sm
                  ${errors.email && touched.email ? 'border-[1.5px] border-red-400 focus:border-red-500 bg-red-50/30' : 
                    touched.email && !errors.email ? 'border-[1.5px] border-emerald-400 focus:border-emerald-500' : 'border border-slate-200/60 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
                }`} />
              <AnimatePresence>{errors.email && touched.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-red-500 font-medium">{errors.email}</motion.p>}</AnimatePresence>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVars}>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase" htmlFor="bookingRef">Booking Ref <span className="text-red-500">*</span></label>
              <input type="text" id="bookingRef" name="bookingRef" value={formData.bookingRef} onChange={handleChange} onBlur={handleBlur} placeholder="BK-12345"
                className={`w-full rounded-xl px-4 py-3 text-[15px] text-slate-800 dark:text-white bg-white/60 dark:bg-slate-900/50 transition-all duration-300 outline-none uppercase hover:bg-white dark:hover:bg-slate-800 shadow-sm
                  ${errors.bookingRef && touched.bookingRef ? 'border-[1.5px] border-red-400 focus:border-red-500 bg-red-50/30' : 
                    touched.bookingRef && !errors.bookingRef ? 'border-[1.5px] border-emerald-400 focus:border-emerald-500' : 'border border-slate-200/60 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
                }`} />
              <AnimatePresence>{errors.bookingRef && touched.bookingRef && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-red-500 font-medium">{errors.bookingRef}</motion.p>}</AnimatePresence>
            </motion.div>

            <motion.div variants={itemVars}>
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase" htmlFor="bookingDate">Booking Date <span className="text-red-500">*</span></label>
              <input type="date" id="bookingDate" name="bookingDate" value={formData.bookingDate} onChange={handleChange} onBlur={handleBlur}
                className={`w-full rounded-xl px-4 py-3 text-[15px] text-slate-800 dark:text-white bg-white/60 dark:bg-slate-900/50 transition-all duration-300 outline-none hover:bg-white dark:hover:bg-slate-800 [&::-webkit-calendar-picker-indicator]:dark:invert shadow-sm
                  ${errors.bookingDate && touched.bookingDate ? 'border-[1.5px] border-red-400 focus:border-red-500 bg-red-50/30' : 
                    touched.bookingDate && !errors.bookingDate ? 'border-[1.5px] border-emerald-400 focus:border-emerald-500' : 'border border-slate-200/60 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
                }`} />
              <AnimatePresence>{errors.bookingDate && touched.bookingDate && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-[13px] text-red-500 font-medium">{errors.bookingDate}</motion.p>}</AnimatePresence>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {showWarning && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <WarningBanner />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVars}>
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase" htmlFor="refundReason">Reason <span className="text-red-500">*</span></label>
            <div className="relative group">
              <select id="refundReason" name="refundReason" value={formData.refundReason} onChange={handleChange} onBlur={handleBlur}
                className={`w-full rounded-xl px-4 py-3 text-[15px] bg-white/60 dark:bg-slate-900/50 transition-all duration-300 outline-none appearance-none hover:bg-white dark:hover:bg-slate-800 cursor-pointer shadow-sm
                  ${errors.refundReason && touched.refundReason ? 'border-[1.5px] border-red-400 focus:border-red-500 bg-red-50/30' : 
                    touched.refundReason && !errors.refundReason ? 'border-[1.5px] border-emerald-400 focus:border-emerald-500' : 'border border-slate-200/60 dark:border-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'
                  } ${!formData.refundReason ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}
              >
                <option value="" disabled className="dark:bg-slate-800">Select a valid reason</option>
                <option value="Property Issue" className="dark:bg-slate-800">Property Issue</option>
                <option value="Booking Error" className="dark:bg-slate-800">Booking Error</option>
                <option value="Personal Reasons" className="dark:bg-slate-800">Personal Reasons</option>
                <option value="Other" className="dark:bg-slate-800">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={itemVars}>
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase">Additional Details <span className="text-slate-400 font-normal lowercase">(optional)</span></label>
            <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} rows={3} placeholder="Provide more context..."
              className="w-full text-slate-800 dark:text-white border border-slate-200/60 dark:border-slate-700 rounded-xl px-4 py-3 text-[15px] bg-white/60 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 resize-none shadow-sm" />
          </motion.div>

          {/* Uploader */}
          <motion.div variants={itemVars}>
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2 tracking-wide uppercase">Supporting Documents <span className="text-slate-400 font-normal lowercase">(optional)</span></label>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
              className={`relative overflow-hidden w-full border-2 border-dashed rounded-[18px] p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] group
                ${isDragging ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-900/40' : 'border-slate-200/80 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-blue-900/20 hover:border-blue-400'}
              `}
            >
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*,.pdf" />
              
              <motion.div animate={{ y: isDragging ? -5 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <UploadCloud className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
              </motion.div>

              <h4 className="text-[15px] text-slate-700 dark:text-slate-200 font-bold mb-1">Drag files here or Browse</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">JPEG, PNG, PDF up to 10MB</p>
            </motion.div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 flex flex-wrap gap-2.5">
                  {files.map((file, idx) => (
                    <motion.div key={`${file.name}-${idx}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-3.5 pr-1.5 py-1.5 rounded-full text-[13px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                    >
                      <File className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      <span className="max-w-[140px] truncate mr-2">{file.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="w-6 h-6 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-colors text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVars} className="pt-4">
            <motion.button
              whileHover={isSubmitting ? {} : { scale: 1.015 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              type="submit" disabled={isSubmitting}
              className={`relative w-full py-4 px-6 rounded-xl text-[16px] font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 focus:outline-none overflow-hidden group
                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/30'}
              `}
            >
              {isSubmitting && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
              
              <span className="flex items-center justify-center relative z-10 transition-transform duration-300">
                {isSubmitting ? (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center">
                     <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processsing...
                  </motion.div>
                ) : 'Submit Request'}
              </span>
            </motion.button>
          </motion.div>
          
        </motion.form>
      </div>
    </div>
  );
}
