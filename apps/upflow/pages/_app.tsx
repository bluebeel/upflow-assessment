import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from '../components/Navbar';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to upflow!</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Navbar/>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
