import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    
    domains:["dbdle.pasiotestudio.hu","localhost"]
  },
  htmlLimitedBots: /.*/,
  output:"export"
  
};

export default nextConfig;
