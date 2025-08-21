/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
  },
  // Environment variables for different environments
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8080',
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig 