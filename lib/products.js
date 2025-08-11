// Utility functions to read product data from the static JSON file.
import products from '../data/products.json';

// Return all products.  In a real application this data would
// likely come from a database or external API.
export function getProducts() {
  return products;
}

// Find a single product by its ASIN.  Returns undefined if no
// product exists with the provided ASIN.
export function getProductByAsin(asin) {
  return products.find((p) => p.asin === asin);
}