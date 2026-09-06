/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ✅ Add deploymentId for version skew protection
  deploymentId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || new Date().toISOString(),
  // ✅ Reduce client-side cache to update faster
  experimental: {
    staleTimes: {
      static: 30,  // 30 seconds instead of 5 minutes
      dynamic: 0,
    }
  },
  // ✅ Add cache headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;