import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devServer: {
    allowedDevOrigins: [
      'https://*.cloudworkstations.dev',
      'https://*.web.app',
      'https://*.firebaseapp.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
