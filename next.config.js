/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Allow remote images hosted on Amazon if product images are added later.
      'images-na.ssl-images-amazon.com',
      'm.media-amazon.com'
    ]
  }
};

module.exports = nextConfig;