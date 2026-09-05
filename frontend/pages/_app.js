import { Inter } from 'next/font/google';

// Font Optimization - Render-blocking network requests remove kar deta hai
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}