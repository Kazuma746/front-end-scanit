/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
  webpack: (config) => {
    // Nécessaire pour utiliser worker-loader avec pdf.js
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig; 