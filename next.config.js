/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is a good practice for packages with native dependencies or complex resolution needs.
    serverComponentsExternalPackages: ['@google/genai'],
  },
  webpack: (config, { isServer }) => {
    // For server-side builds, we explicitly tell webpack not to bundle '@google/genai'.
    // It will be treated as an external dependency and required at runtime.
    // This is a robust way to solve "Module not found" errors for server-side code.
    if (isServer) {
      config.externals.push('@google/genai');
    }
    
    // This is a workaround for a webpack issue with some native dependencies.
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    
    return config;
  }
};

export default nextConfig;