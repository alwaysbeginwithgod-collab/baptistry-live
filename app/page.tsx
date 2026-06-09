'use client';

import dynamic from 'next/dynamic';

const MainContent = dynamic(() => import('./MainContent'), {
  ssr: false,
});

export default function Home() {
  return <MainContent />;
}