/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config,  {isServer}) => {
        config.module.rules.push({ test: /\.node$/, use: 'raw-loader'})

        if(!isServer) config.externals.push('canvas');
        return config; 
    },
    async rewrites(){
       return [
            {
                source: '/api/:path*', // Match any route starting with /api
                destination: 'http://localhost:5000/api/:path*', // Proxy to the server on localhost:5000
            },
          ]
    },
    env: {
        IMAGES_PORT_URL: 'http://localhost:5000/uploadedImage',
        SERVER_POST_URL: "http://localhost:5000/uploadedVideos",
        NEXT_IMAGE_URL: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
}

module.exports = nextConfig
