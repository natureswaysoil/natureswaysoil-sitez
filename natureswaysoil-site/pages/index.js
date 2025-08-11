import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '../lib/products';
import ProductCard from '../components/ProductCard';

/**
 * Home page for the Nature's Way Soil website.  Presents a hero
 * section with the company logo and tagline, a brief introduction
 * describing the business and a grid of featured products pulled
 * from the product list.  Additional products can be viewed on the
 * dedicated products page.
 */
export default function Home({ featured }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Nature's Way Soil logo" width={80} height={80} />
            <div>
              <h1 className="text-2xl font-bold text-primary">Nature's Way Soil</h1>
              <p className="text-sm text-secondary">From our farm to your garden</p>
            </div>
          </div>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Welcome to Nature's Way Soil</h2>
          <p className="text-lg max-w-2xl mx-auto">
            We produce premium organic soil blends, fertilisers and amendments
            using sustainable practices.  Our mission is to bring the
            nutrients from our farm directly to your garden so your plants
            can thrive naturally.
          </p>
        </section>
        <section>
          <h3 className="text-2xl font-semibold mb-4">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.asin} product={product} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/products" className="text-primary underline">View all products →</Link>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Nature's Way Soil.  All rights reserved.
      </footer>
    </div>
  );
}

// Fetch a few products at build time.  In this example we just
// return the first six products; you could implement more complex
// logic such as randomly selecting featured products or filtering by
// category.
export async function getStaticProps() {
  const products = getProducts();
  return {
    props: {
      featured: products.slice(0, 6)
    }
  };
}