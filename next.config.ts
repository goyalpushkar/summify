import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* This is added to avoid using server side modules from being included in the
   client-side bundle.
   Build process was giving error for modules like dns dgram that are node.js buil tin modules
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        dns: false,
        dgram: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
