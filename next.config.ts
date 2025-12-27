import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"utfs.io"
      },
      {
        protocol:"https",
        hostname:"glnc0e9de1.ufs.sh"
      },
    ]
  }
};

export default nextConfig;
