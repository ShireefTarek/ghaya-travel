import prisma from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const packages = await prisma.package.findMany({ select: { slug: true, updatedAt: true } });
  const posts = await prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } });

  const packageEntries = packages.flatMap((pkg) => [
    {
      url: `${baseUrl}/ar/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt
    },
    {
      url: `${baseUrl}/en/packages/${pkg.slug}`,
      lastModified: pkg.updatedAt
    }
  ]);

  const blogEntries = posts.flatMap((post) => [
    {
      url: `${baseUrl}/ar/blog/${post.slug}`,
      lastModified: post.updatedAt
    },
    {
      url: `${baseUrl}/en/blog/${post.slug}`,
      lastModified: post.updatedAt
    }
  ]);

  const staticRoutes = ['', '/packages', '/about', '/blog', '/contact', '/hajj-umrah', '/flights'];
  const staticEntries = staticRoutes.flatMap((route) => [
    {
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/en${route}`,
      lastModified: new Date()
    }
  ]);

  return [...staticEntries, ...packageEntries, ...blogEntries];
}
