import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // next.config.js의 내용을 여기에 복사합니다.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nfiqmgurjakbthpolcci.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "velog.velcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
