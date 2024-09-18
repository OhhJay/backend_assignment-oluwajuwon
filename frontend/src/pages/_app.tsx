import type { AppProps } from 'next/app';
import '../styles/globals.css';  
import '../styles/toastStyles.css'; 
import 'react-toastify/dist/ReactToastify.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer /> {}
    </>
  );
}

export default MyApp;
