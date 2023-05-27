import Header from '@/components/Header';
import { ModalContextProvider } from '@/components/context/ModalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';

import '@/styles/globals.css';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContextProvider>
        <Header />
        <Component {...pageProps} />
      </ModalContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
