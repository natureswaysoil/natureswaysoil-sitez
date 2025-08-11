import { useState } from 'react';
import Link from 'next/link';

/**
 * Contact page with a simple form that allows visitors to send a
 * message.  The form submits to the `/api/contact` endpoint and
 * displays a confirmation upon success or an error message if
 * something goes wrong.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Thanks for your message! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      setStatus('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/products" className="hover:underline">Products</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-lg">
        <p className="mb-4">
          We'd love to hear from you.  Please fill out the form below and we'll
          respond as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Send Message
          </button>
        </form>
        {status && <p className="mt-4 text-primary">{status}</p>}
      </main>
    </div>
  );
}