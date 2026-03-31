import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Refund Request Portal',
  description: 'Submit your refund request quickly and easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#FAFAFA] dark:bg-[#0A0F1C] text-slate-800 dark:text-slate-100 min-h-screen`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
