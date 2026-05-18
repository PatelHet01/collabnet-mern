import { Inter, DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const display = DM_Sans({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });

export const metadata = {
  title: 'CollabNet — Influencer marketing for India',
  description: 'Brands, creators, and agencies collaborate on campaigns. Budgets in INR.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} font-sans`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
