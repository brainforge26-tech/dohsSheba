import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { LanguageProvider } from '@/providers/language-provider';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#181928',
};

export const metadata: Metadata = {
  title: 'dohsSheba | Home Services & Grocery Marketplace for DOHS',
  description:
    'Book verified electricians, plumbers, AC repair, home cleaners or order fresh vegetables, fruits & daily groceries in Savar DOHS.',
  manifest: '/manifest.json',
  keywords: [
    'dohsSheba',
    'Savar DOHS',
    'Savar DOHS Home Services',
    'Savar DOHS Grocery Express',
    'Savar DOHS Electrician',
    'AC Repair Savar DOHS',
    'Savar DOHS Plumber',
    'Fresh Market Savar DOHS',
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'dohsSheba',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth notranslate" suppressHydrationWarning translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <LanguageProvider>
              {children}
              <WhatsAppButton />
            </LanguageProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
