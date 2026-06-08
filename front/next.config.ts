import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["http://localhost:3000", "unschismatical-unrivaled-cherish.ngrok-free.dev"],
};

export default nextConfig;
