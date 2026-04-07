import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/lib/context/WalletContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FlyraOS — NFT Treasury Protocol',
  description:
    'Professional-grade NFT treasury protocol on the Stacks blockchain. Browse, trade, and manage FLYRA-backed NFTs.',
  other: {
    'talentapp:project_verification': 'd36a194a89d071c3b7e6f59f2b8b002ec0ab1b119bd74e9437b84def50963e5fee8caf10c8440396bd155f88c03ea721b942483d80e75120d660ea37cfbf6156',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <WalletProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
