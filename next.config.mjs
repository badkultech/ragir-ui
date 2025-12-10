/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
 
  webpack: (config, { isServer }) => {
    // Enable readable source maps during build (for easier debugging)
    if (isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

export default nextConfig;
