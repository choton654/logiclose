/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // path: "https://storage.cloud.google.com/logiclose/",
    disableStaticImages: false,
    domains: ['storage.cloud.google.com']
  }
}

export default nextConfig
