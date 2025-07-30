module.exports = {
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
