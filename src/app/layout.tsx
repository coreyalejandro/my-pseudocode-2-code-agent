import '../styles/globals.css';
import '../styles/card.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Pseudocode & Flowchart Ninja',
  description: 'Accessible AI agent converting logic to code & flowcharts.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
