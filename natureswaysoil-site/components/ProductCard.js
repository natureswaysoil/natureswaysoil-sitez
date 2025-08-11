import Image from 'next/image';
import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Card component to render a single product.  Displays a product image
 * (if provided), title, price and an Add to Cart button.
 */
export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAdd = () => {
    addToCart(product, 1);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center shadow-sm bg-white">
      {product.image ? (
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="object-cover rounded"
        />
      ) : (
        <div className="w-52 h-52 flex items-center justify-center bg-gray-100 rounded mb-2">
          <span className="text-gray-400 text-sm">Image coming soon</span>
        </div>
      )}
      <h3 className="mt-2 font-semibold text-center text-lg">
        {product.title}
      </h3>
      {product.price != null && (
        <p className="mt-1 text-primary font-bold text-lg">
          ${product.price.toFixed(2)}
        </p>
      )}
      <button
        onClick={handleAdd}
        className="mt-auto px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}