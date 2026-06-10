import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Liquid Glass Agent',
  description: 'Aura — Infinite Node Canvas AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-canvas-bg text-white antialiased h-full overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
