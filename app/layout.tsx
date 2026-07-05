'use client';

import './globals.css'
import { ThemeProvider } from './context/ThemeContext'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import PWAInstall from './components/PWAInstall';
import MaintenanceMode from './components/MaintenanceMode';

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
          <html lang="en">
            <head>
              <link rel="manifest" href="/manifest.json" />
              <meta name="theme-color" content="#0a1628" /> {/* Updated to dark navy */}
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
              <link rel="apple-touch-icon" href="/baptistry-logo.png" />
              <title>BAPTISTRY - Your Bible Study Tool</title>
              <meta name="description" content="Biblical teaching from the King James Version" />
              <link rel="icon" href="/baptistry-logo.png" />
              {/* Golden-yellow brand color for browser UI */}
              <meta name="theme-color" content="#D4A017" media="(prefers-color-scheme: light)" />
              <meta name="theme-color" content="#0a1628" media="(prefers-color-scheme: dark)" />
            </head>
            <body className="app-container">
              <Script 
                src="https://www.paypal.com/sdk/js?client-id=BAAdMBwnGSRahrsJy5-2A9wIqaqgZOjVM0jLL0kauYAny-raGaAZh8Xozwou1oAL4n07BEVdl2ex6WUdVM&components=hosted-buttons&disable-funding=venmo&currency=USD"
                strategy="afterInteractive"
              />
              {children}
              <Analytics />
              <PWAInstall />
              <MaintenanceMode />
            </body>
          </html>
        </ThemeProvider>
      </ClerkProvider>
    </ConvexProvider>
  );
}