import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import AppLayout from '@/components/app-layout';
import { Providers } from '@/components/providers';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'RemittEase - Global Payments',
  description: 'Seamless cross-border payments with Web3 technology'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-dvh w-full`}
        style={{ margin: 0, padding: 0, width: '100%' }}
      >
        <div 
          className="w-full min-h-dvh"
          style={{ width: '100%', margin: '0 auto', padding: 0 }}
        >
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
          <Analytics />
        </div>
      </body>
    </html>
  );
}