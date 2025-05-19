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
                // This should route to the backend directly without duplicating paths
                source: '/api/:path*',
                destination: `${apiUrl}/api/:path*`,
            },
        ];
    },
    
    // Add output configuration for production builds
    // Comment this out if you want to use the default Next.js output
    // output: 'standalone', // Uncomment for Docker deployments
};

module.exports = nextConfig; 