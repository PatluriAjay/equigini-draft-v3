/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/admin',
          permanent: true, // Set to false if it's temporary
        },
      ];
    },
  };
  
  export default nextConfig;
  