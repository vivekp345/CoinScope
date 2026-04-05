// next.config.mjs
export default () => ({
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/coins/images/**",
      },
    ],
  },
});