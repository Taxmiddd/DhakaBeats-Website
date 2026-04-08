import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Don't crawl the admin panel
    },
    sitemap: 'https://dhakabeats.com/sitemap.xml',
  }
}
