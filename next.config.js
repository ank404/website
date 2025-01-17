/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static export
    images: {
      unoptimized: true, // Disables `next/image` optimization for static builds
    },
  };
  
  module.exports = nextConfig;
  