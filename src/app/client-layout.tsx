'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { NavbarWrapper } from '@/components/navbar-wrapper'
import { NotificationHandler } from './NotificationHandler'
import Footer from '@/components/Footer'
import { useEffect } from 'react'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <ClerkProvider>
      <NavbarWrapper />
      <NotificationHandler />
      <main className="pt-16">{children}</main>
      <Footer />
    </ClerkProvider>
  )
}
