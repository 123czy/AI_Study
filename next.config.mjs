/** @type {import('next').NextConfig} */
const nextConfig = {
  // api: {
  //   bodyParser: {
  //     sizeLimit: '10mb',
  //   },
  //   responseLimit: false,
  // },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
        ],
      },
    ]
  },
  // reactStrictMode: false,
}

export default nextConfig
