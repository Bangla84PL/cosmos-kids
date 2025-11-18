import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CosmosKids - Explore the Universe',
  description:
    'An AI-powered educational platform that makes learning about space, astronomy, and science fun and engaging for children ages 6-12.',
  keywords: ['education', 'space', 'astronomy', 'kids', 'learning', 'AI', 'SmartCamp.AI'],
  authors: [{ name: 'SmartCamp.AI', url: 'https://smartcamp.ai' }],
  openGraph: {
    title: 'CosmosKids - Explore the Universe',
    description: 'AI-powered space education for kids ages 6-12',
    url: 'https://cosmoskids.smartcamp.ai',
    siteName: 'CosmosKids',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CosmosKids',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CosmosKids - Explore the Universe',
    description: 'AI-powered space education for kids ages 6-12',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-3 text-center text-body-sm text-gray border-t border-light-gray">
          <p>
            © Created with ❤️ by{' '}
            <a
              href="https://smartcamp.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-jungle hover:text-brand-mint"
            >
              SmartCamp.AI
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
