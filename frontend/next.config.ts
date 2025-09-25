import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    unoptimized:true
  },
  htmlLimitedBots: /.*/,
  //output:"export"
  
};

export default nextConfig;
