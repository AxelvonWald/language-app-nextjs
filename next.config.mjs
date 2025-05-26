import i18nConfig from './next-i18next.config.mjs';  // Changed to default import

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig,  // Now using the config object
};

export default nextConfig;