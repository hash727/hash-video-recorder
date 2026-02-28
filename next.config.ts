import type { NextConfig } from "next";
import { headers } from "next/headers";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
  
};

module.exports = {
  async headers(){
    return [
      {
        source: '/(.*)',
        headers: [
          {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
          {key: 'Cross-Origin-Embedder-Policy', value: 'require-corp'},
        ],
      },
    ]
  },
}

export default nextConfig;
