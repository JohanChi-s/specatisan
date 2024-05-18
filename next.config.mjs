import million from "million/compiler";
import webpackNodeExternals  from "webpack-node-externals";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lzikiidzevbmtqyuqhgk.supabase.co"],
  },
};

export default million.next(nextConfig);
