/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // In a real project, ignoring type checks is not recommended
    // This is only for the demo purpose
    ignoreBuildErrors: true,
  },
  eslint: {
    // We're ignoring ESLint errors for the demo
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
