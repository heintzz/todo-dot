/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ACTIVITY_ENDPOINT: process.env.ACTIVITY_ENDPOINT,
    TODO_ENDPOINT: process.env.TODO_ENDPOINT,
  },
};

module.exports = nextConfig;
