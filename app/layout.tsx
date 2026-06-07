'use client';

import './globals.css'
import { ThemeProvider } from './context/ThemeContext'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en">
          <head>
            <title>BAPTISTRY - KJV Bible Teaching</title>
            <meta name="description" content="Biblical teaching from the King James Version" />
            <link rel="icon" href="/baptistrylogo.png" />
          </head>
          <body>
            {/* PayPal SDK - Loads once */}
            <Script 
              src="https://www.paypal.com/sdk/js?client-id=BAAdMBwnGSRahrsJy5-2A9wIqaqgZOjVM0jLL0kauYAny-raGaAZh8Xozwou1oAL4n07BEVdl2ex6WUdVM&components=hosted-buttons&disable-funding=venmo&currency=USD"
              strategy="afterInteractive"
            />
            {children}
            <Analytics />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}