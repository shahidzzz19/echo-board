/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // News outlets
      { protocol: "https", hostname: "cdn.cnn.com" },
      { protocol: "https", hostname: "media.cnn.com" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "static01.nyt.com" },
      { protocol: "https", hostname: "assets.bwbx.io" },
      { protocol: "https", hostname: "media.reuters.com" },
      { protocol: "https", hostname: "images.wsj.net" },
      { protocol: "https", hostname: "www.rollingstone.com" },
      { protocol: "https", hostname: "platform.theverge.com" },
      { protocol: "https", hostname: "i.insider.com" },
      { protocol: "https", hostname: "gizmodo.com" },
      { protocol: "https", hostname: "media.wired.com" },
      { protocol: "https", hostname: "npr.brightspotcdn.com" },
      { protocol: "https", hostname: "kotaku.com" },
      { protocol: "https", hostname: "cdn.vox-cdn.com" },
      { protocol: "https", hostname: "static.politico.com" },
      { protocol: "https", hostname: "s.yimg.com" },
      { protocol: "https", hostname: "nypost.com" },
      { protocol: "https", hostname: "uploads.guim.co.uk" },
      { protocol: "https", hostname: "techcrunch.com" },
      { protocol: "https", hostname: "cdn.arstechnica.net" },

      // Reddit & social
      { protocol: "https", hostname: "external-preview.redd.it" },
      { protocol: "https", hostname: "b.thumbs.redditmedia.com" },
      { protocol: "https", hostname: "preview.redd.it" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },

      // Entertainment/media
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "assets-prd.ignimgs.com" },

      // Generic placeholder/CDN
      { protocol: "https", hostname: "placekitten.com" },
      { protocol: "https", hostname: "picsum.photos" },

      // Wildcards
      { protocol: "https", hostname: "*.brightspotcdn.com" },
      { protocol: "https", hostname: "*.wp.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.akamaihd.net" },
      { protocol: "https", hostname: "*.fastly.net" },
      { protocol: "https", hostname: "*.cdn.digitaloceanspaces.com" },

      // CNET
      { protocol: "https", hostname: "www.cnet.com" },

      // Mashable
      { protocol: "https", hostname: "mashable.com" },

      // Verge extra CDN
      { protocol: "https", hostname: "*.theverge.com" },

      // Engadget
      { protocol: "https", hostname: "www.engadget.com" },
    ],
  },
  reactStrictMode: true,
}

export default nextConfig
