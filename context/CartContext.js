import { createContext, useState, useEffect } from 'react';

// A simple React context to manage the shopping cart.  The cart
// persists in localStorage so that users don't lose their cart when
// refreshing the page.  Each cart item has an `asin`, a `title`, a
// `price` and a `quantity`.
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on first render.
  useEffect(() => {
    const stored = typeof window !== 'undefined' && window.localStorage.getItem('cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
      }
    }
  }, []);

  // Persist cart to localStorage whenever it changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add a product to the cart.  If the product is already in the cart,
  // its quantity is incremented.  Otherwise it is added with the
  // provided quantity (default 1).
  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const index = current.findIndex((item) => item.asin === product.asin);
      if (index === -1) {
        return [...current, { ...product, quantity }];
      }
      const newCart = [...current];
      newCart[index].quantity += quantity;
      return newCart;
    });
  };

  // Remove a product from the cart entirely.
  const removeFromCart = (asin) => {
    setCart((current) => current.filter((item) => item.asin !== asin));
  };

  // Clear the entire cart.
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;