/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "avatars.githubusercontent.com", // GitHub
          "lh3.googleusercontent.com", // Google
          "appleid.apple.com" // Apple (if using Apple profile pictures)
        ],
      },
};

export default nextConfig;
