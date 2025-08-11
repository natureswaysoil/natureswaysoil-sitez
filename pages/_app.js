import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import ChatWidget from '../components/ChatWidget';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      {/* Render the chat widget on every page. */}
      <ChatWidget />
    </CartProvider>
  );
}

export default MyApp;