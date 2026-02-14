import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// ⨯ Error: Invalid src prop (https://duzswvwtwcafa.cloudfront.net/posts/2b4f43437bda8033a96cfea7b9d05e33/31f2b036.webp) on `next/image`, hostname "duzswvwtwcafa.cloudfront.net" is not configured under images in your `next.config.js`
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "duzswvwtwcafa.cloudfront.net",
        port: "",
        pathname: "/posts/**",
        search: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
