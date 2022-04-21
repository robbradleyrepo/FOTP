if (!process.env.ORIGIN) {
  throw new Error("Missing ORIGIN envvar");
}

module.exports = {
  exclude: ["/cms-sitemap.xml"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.ORIGIN}/sitemap.xml`,
      `${process.env.ORIGIN}/cms-sitemap.xml`,
    ],
    policies:
      process.env.ENVIRONMENT === "prod"
        ? [
            {
              disallow: [
                "/[region]",
                "/api/",
                "/preview",
                "/private",
                "/_test",
              ],
              userAgent: "*",
            },
          ]
        : [
            {
              disallow: "*",
              userAgent: "*",
            },
          ],
  },
  siteUrl: process.env.ORIGIN,
  /**
   * @param {string} path
   */
  transform: async (config, path) => {
    // next-sitemap does not gracefully handle the default locale.
    // We get almost all default locale URLs but not all of them. The
    // easiest work around I can see is to drop all default locales and
    // strip the locale from the default locale.
    if (!path.startsWith("/en-US")) {
      return null;
    }

    const loc = path.replace("/en-US", "") || "/";

    // Strip anything we don't want to expose.
    if (
      loc.includes("/cart-offers/") ||
      loc.startsWith("/404") ||
      loc.startsWith("/cart/restore") ||
      loc.startsWith("/checkout/") ||
      loc.startsWith("/feedback/") ||
      loc.startsWith("/info/") ||
      loc.startsWith("/landing/") ||
      loc.startsWith("/offer/") ||
      loc.startsWith("/private/") ||
      loc.startsWith("/videos/") ||
      loc.startsWith("/food/plan/") ||
      loc.startsWith("/food/early-access/") ||
      loc === "/reviews/thank-you"
    ) {
      return null;
    }

    // Strip anything that should appear in the dynamic sitemaps
    if (
      // cms-sitemap.xml
      loc.startsWith("/blog/") ||
      loc.startsWith("/learn/") ||
      loc.startsWith("/science/ingredients/")
    ) {
      return null;
    }

    return {
      alternateRefs: config.alternateRefs || [],
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      loc: loc,
      priority: config.priority,
    };
  },
};
