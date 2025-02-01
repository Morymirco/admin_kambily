/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'kambily.ddns.net',
                port: '',
                pathname: '/media/**',
            },
        ],
        unoptimized: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

export default nextConfig;