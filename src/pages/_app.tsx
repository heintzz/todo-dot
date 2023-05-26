import Header from '@/components/Header';
import { ModalContextProvider } from '@/components/context/ModalContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalContextProvider>
      <Header />
      <Component {...pageProps} />
    </ModalContextProvider>
  );
}
