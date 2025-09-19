/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for static hosting on Netlify
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with routing on Netlify
};

module.exports = nextConfig;
