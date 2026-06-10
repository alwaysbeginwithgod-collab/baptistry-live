'use client';

import './globals.css'
import { ThemeProvider } from './context/ThemeContext'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ChatProvider } from './context/ChatContext';

// Create the Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexProvider client={convex}>
      <ClerkProvider>
        <ThemeProvider>
          <ChatProvider>
            <html lang="en">
              <head>
                <title>BAPTISTRY - KJV Bible Teaching</title>
                <meta name="description" content="Biblical teaching from the King James Version" />
                <link rel="icon" href="/baptistry-logo.png" />
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
          </ChatProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ConvexProvider>
  );
}