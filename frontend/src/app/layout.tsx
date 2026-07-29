import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { LanguageProvider } from '@/providers/language-provider';

export const metadata: Metadata = {
  title: 'dohsSheba | Home Services & Grocery Marketplace for DOHS',
  description:
    'Book verified electricians, plumbers, AC repair, home cleaners or order fresh vegetables, fruits & daily groceries in DOHS Mohakhali, Baridhara, Mirpur & Banani.',
  keywords: [
    'dohsSheba',
    'DOHS Home Services',
    'DOHS Grocery Express',
    'Mohakhali DOHS Electrician',
    'AC Repair DOHS',
    'Baridhara DOHS Plumber',
    'Fresh Market Dhaka',
  ],
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
            </LanguageProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
