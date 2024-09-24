/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-redux'],

  // Add the webpack configuration within the Next.js configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    });
    return config;
  },
};

export default nextConfig;