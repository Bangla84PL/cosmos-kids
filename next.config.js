/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.supabase.smartcamp.ai',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  // Disable telemetry
  telemetry: false,
};

module.exports = nextConfig;
