import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["static.www.nfl.com", "res.cloudinary.com", "upload.wikimedia.org", "images.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // Adjust this URL to match your Spring Boot backend
      },
    ];
  },
};

export default nextConfig;
