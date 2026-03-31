import ConfirmationSummary from '@/components/ConfirmationSummary';
import { FileDown, RefreshCcw, HandHeart } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';

// Disable caching so we always fetch the latest dynamically generated request directly from DB
export const revalidate = 0;

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params to fix Next.js 15 breaking changes where params is a Promise
  const resolvedParams = await params;
  const requestId = resolvedParams.id;

  // 0. Validate UUID format to prevent Postgres syntax crash
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!requestId || !uuidRegex.test(requestId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Invalid Submission Link</h2>
        <p className="text-gray-500 mb-6">The URL provided does not contain a valid Request ID.</p>
        <div className="bg-slate-100 p-4 border border-slate-300 rounded mb-4 w-full max-w-[400px]">
          <p className="font-mono text-[11px] text-slate-800 break-all w-full">Received ID: "{params.id}"</p>
        </div>
        <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Return Home</a>
      </div>
    );
  }

  // 1. Fetch Request from Supabase Database
  const { data: request, error: reqError } = await supabaseAdmin
    .from('refund_requests')
    .select('*')
    .eq('id', params.id)
    .single();

  if (reqError || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Request Not Found or Error</h2>
        <p className="text-gray-500">{reqError?.message || 'Could not locate this request ID in the database'}</p>
        <pre className="text-xs bg-gray-100 p-4 mt-4 rounded-md">ID: {params.id}</pre>
      </div>
    );
  }

  // 2. Fetch Assigned Files from Supabase Database
  const { data: files } = await supabaseAdmin
    .from('refund_request_files')
    .select('*')
    .eq('request_id', params.id);

  // 3. Format Data securely
  const formattedData = {
    fullName: request.full_name,
    email: request.email,
    bookingRef: request.booking_ref,
    bookingDate: request.booking_date,
    refundReason: request.refund_reason,
    additionalDetails: request.additional_details,
    refId: request.ref_id,
    fileUrls: files?.map((f: any) => ({ name: f.filename, url: f.url })) || []
  };

  return (
    <main className="flex min-h-screen w-full font-sans text-gray-900 bg-[#F5F7FA]">
      {/* Left Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] fixed top-0 left-0 h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6] flex-col justify-center p-12 lg:p-16 xl:p-20 text-white z-10 box-border overflow-hidden">
        
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#60A5FA] blur-[120px] rounded-full opacity-30 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3B82F6] blur-[140px] rounded-full opacity-40 pointer-events-none" />

        <div className="relative z-10 opacity-100 transform-none">
          <h1 className="text-4xl xl:text-[52px] font-extrabold mb-6 tracking-tight leading-[1.1] drop-shadow-lg text-white">
            Guest Refund Portal
          </h1>
          <p className="text-blue-100 text-lg xl:text-xl mb-14 max-w-[420px] leading-relaxed font-light">
            We've found your record safely stored in our database. The team will review it within 3-5 business days.
          </p>

          <div className="flex flex-col gap-7 max-w-[400px] w-full">
            <div className="flex items-center gap-5 group">
              <div className="bg-white/10 p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <span className="text-[17px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">Secure file attachments</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent" />
            <div className="flex items-center gap-5 group">
              <div className="bg-white/10 p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300">
                <RefreshCcw className="w-6 h-6 text-white" />
              </div>
              <span className="text-[17px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">Real-time status tracking</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent" />
            <div className="flex items-center gap-5 group">
              <div className="bg-white/10 p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-[17px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">Case-by-case review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[55%] xl:w-[60%] lg:ml-[45%] xl:ml-[40%] min-h-screen relative flex flex-col justify-center py-10 px-4 sm:px-6 lg:py-16 box-border font-sans">
        
        {/* Mobile Header */}
        <div className="lg:hidden mb-10 text-center w-full mt-4 opacity-100 transform-none">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
             <RefreshCcw className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[28px] xs:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Refund Portal</h1>
        </div>
        
        {/* Form Container */}
        <div className="w-full h-full flex items-center justify-center opacity-100 transform-none">
          <ConfirmationSummary initialData={formattedData} />
        </div>
      </div>
    </main>
  );
}
