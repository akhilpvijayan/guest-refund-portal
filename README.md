# Refund Request Portal

A beautiful, premium, and fully responsive **Refund Request Portal** built natively with the Next.js App Router. This application allows users to seamlessly submit refund requests, drag-and-drop secure document evidence, and receive an instant, animated confirmation containing a verified database retrieval summary. 

The aesthetic leverages modern "frosted glass" (Glassmorphism) techniques, fluid micro-animations via `framer-motion`, and a meticulously synced Dark & Light mode system powered by Tailwind v4.

## 🚀 Features & Upgrades

- **Modern Glassmorphic UI:** Smooth, premium layouts with blurred backdrop panels seamlessly resting on highly diffused radial gradients.
- **Perfect Dark/Light Mode:** Full integration with `next-themes` and Tailwind v4. It automatically detects OS preferences and features an elegant top-corner manual toggle. The Light Mode is designed with soft #FAFAFA backgrounds to reduce eye strain, while Dark Mode boasts deep slate aesthetics.
- **Micro-Animations:** Fluid layout transitions, springy scale effects on interactive elements, and gracefully staggered lists built on top of `framer-motion`.
- **Drag & Drop Evidence Upload:** Multi-file drag and drop UI complete with instant validation and dynamic hover feedback.
- **Instant Inline Confirmation:** Upon successful submission, the form gracefully transitions out to reveal a shiny, dynamically hydrated "Ticket-style" success receipt.
- **Supabase Backend:** Secure database ingestion and file storage using PostgreSQL Edge APIs.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Theme Management:** `next-themes`
- **Database & Storage:** Supabase (Postgres Database & Cloud Buckets)
- **Deployment:** Vercel / serverless node functions


## ⚙️ Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Supabase Database Schema Setup:**
   Run the following SQL in your Supabase dashboard SQL Editor:
   ```sql
   -- Create refund_requests table
   CREATE TABLE public.refund_requests (
     id UUID PRIMARY KEY,
     ref_id TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     email TEXT NOT NULL,
     booking_ref TEXT NOT NULL,
     booking_date DATE NOT NULL,
     refund_reason TEXT NOT NULL,
     additional_details TEXT,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Create refund_request_files table
   CREATE TABLE public.refund_request_files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     request_id UUID REFERENCES public.refund_requests(id) ON DELETE CASCADE,
     filename TEXT NOT NULL,
     storage_path TEXT NOT NULL,
     url TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   ```

3. **Supabase Storage Setup:**
   - In the Supabase Dashboard, go to **Storage**.
   - Click "New bucket".
   - Name it exactly: `refund-evidence`
   - Mark it as a **Public** bucket.

4. **Environment Variables:**
   Create a `.env.local` file in the root of the project with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   > **Note**: Never expose your `SUPABASE_SERVICE_ROLE_KEY` to the client. Keep this private.

5. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment to Vercel

1. Push your code to GitHub.
2. Go to Vercel, navigate to **Add New > Project**, and select your imported repository.
3. Keep the defaults and navigate to the **Environment Variables** section. Add all 3 variables from your `.env.local` file.
4. Click **Deploy**. That's it!
