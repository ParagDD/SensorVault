/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,
    
    // Rewrite API requests to the backend
    async rewrites() {
        // Get API URL from environment or default to localhost:8000
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        
        return [
            {
                // Rewrite all /api/v1/ requests to the backend
                source: '/api/v1/:path*',
                destination: `${apiUrl}/api/v1/:path*`,
            },
        ];
    },
    
    // Add output configuration for production builds
    // Comment this out if you want to use the default Next.js output
    // output: 'standalone', // Uncomment for Docker deployments
};

module.exports = nextConfig; 