// next.config.mjs
import i18nConfig from './next-i18next.config.mjs';  // whatever your import is

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig,
  async redirects() {
    return [
      {
        source: '/',         // incoming “/”
        destination: '/courses',  // send them to “/courses”
        permanent: true      // 301 redirect
      }
    ];
  },
};

export default nextConfig;
