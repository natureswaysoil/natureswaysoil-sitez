import Stripe from 'stripe';
import { getProductByAsin } from '../../lib/products';

/**
 * API route for creating a Stripe Checkout Session.  Expects a POST
 * request with a `cart` array in the body.  Each cart item must
 * include an `asin` and a `quantity`.  The product data (title,
 * price) is looked up via `getProductByAsin` and used to construct
 * the line items for the session.  A `STRIPE_SECRET_KEY` environment
 * variable must be provided.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  const stripe = new Stripe(stripeSecret);
  const { cart } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart must not be empty' });
  }
  try {
    const lineItems = cart.map((item) => {
      const product = getProductByAsin(item.asin);
      if (!product) {
        throw new Error(`Unknown product: ${item.asin}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: product.image ? [product.image] : []
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: item.quantity
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || 'http://localhost:3000/success',
      cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || 'http://localhost:3000/cancel'
    });
    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}