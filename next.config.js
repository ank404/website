/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  images: {
    unoptimized: true, // Disables `next/image` optimization for static builds
  },
  // Prevent CSS errors by including this config
  webpack: (config) => {
    return config;
  },
};
  
module.exports = nextConfig;
  