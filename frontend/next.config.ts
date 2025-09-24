import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    
    domains:["dbdle.pasiotestudio.hu","localhost"]
  },
  htmlLimitedBots: /.*/,
  
};

export default nextConfig;
