/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ACTIVITY_ENDPOINT: process.env.ACTIVITY_ENDPOINT,
  },
};

module.exports = nextConfig;
