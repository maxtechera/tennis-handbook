import React from 'react';
import PWAInstallBanner from '../components/PWAInstallBanner';
import GoogleAnalytics from '../components/GoogleAnalytics';

// Root wrapper is called for every page in your app
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      {children}
      <PWAInstallBanner />
    </>
  );
}