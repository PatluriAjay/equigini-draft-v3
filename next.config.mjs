// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     async redirects() {
//       return [
//         {
//           source: '/',
//           destination: '/admin',
//           permanent: true, // Set to false if it's temporary
//         },
//       ];
//     },
//   };
  
//   export default nextConfig;
  

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'localhost:4000'], // Allow loading images from localhost
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/admin',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
