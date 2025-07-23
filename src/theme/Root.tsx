import React from 'react';
import PWAInstallBanner from '../components/PWAInstallBanner';

// Root wrapper is called for every page in your app
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PWAInstallBanner />
    </>
  );
}