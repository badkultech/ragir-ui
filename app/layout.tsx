// app/layout.tsx
import React from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ReduxProvider } from '@/lib/redux-provider';
import HydratedAuth from '@/components/AuthLoader';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth';

export const metadata = {
  title: 'Ragir - Organizer Dashboard',
  description: 'Travel organizer dashboard for managing trips and analytics',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
 
  return (
    <html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className='font-sans antialiased'>
        <ReduxProvider>
          <HydratedAuth>{children}</HydratedAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
