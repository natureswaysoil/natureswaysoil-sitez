import { getProducts } from '../lib/products';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

/**
 * Products page.  Displays all available products in a responsive
 * grid.  Users can add products to their cart directly from this
 * page.  A link back to the home page is provided in the header.
 */
export default function Products({ products }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Products</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.asin} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const products = getProducts();
  return {
    props: { products }
  };
}