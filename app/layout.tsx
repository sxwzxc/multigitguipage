import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Brand | Creative Agency',
  description: 'We create digital experiences that elevate your brand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}