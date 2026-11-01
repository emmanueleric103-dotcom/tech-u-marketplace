const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { domains: ['*.supabase.co'] },
  experimental: { workerThreads: false, cpus: 1 },
  staticPageGenerationTimeout: 1000
}
module.exports = nextConfig
