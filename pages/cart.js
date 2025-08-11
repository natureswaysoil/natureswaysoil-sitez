import { useContext } from 'react';
import CartContext from '../context/CartContext';
import Link from 'next/link';

/**
 * Cart page.  Lists the items currently in the user's cart and
 * provides a checkout button.  When clicked the checkout button
 * creates a Stripe checkout session via the `/api/checkout` endpoint
 * and redirects the user to Stripe's checkout page.  Users can also
 * remove items from their cart before checking out.
 */
export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Your Cart</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.asin} className="flex items-center justify-between border-b pb-2">
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.asin)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={checkout}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}