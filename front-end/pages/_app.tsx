import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from "next/head";
import { ContextProvider } from "./api/connect";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Rebase Badge</title>
      <meta name="description" content="Rebase Badge Minter" />
      <link rel="icon" href="/rebasebadge/favicon.ico" />
    </Head>
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
    <link rel="stylesheet" href="https://web3camp.us/globals.css" />
  </>
}

export default MyApp
