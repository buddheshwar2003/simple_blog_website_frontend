import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode:false
};
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blg-web-img.s3.amazonaws.com",
      },
    ],
  },
};
export default nextConfig;
