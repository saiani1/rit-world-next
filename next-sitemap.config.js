/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ritworld.dev",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/ko/signin", "/jp/signin"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ko/signin", "/jp/signin"],
      },
    ],
  },
};
