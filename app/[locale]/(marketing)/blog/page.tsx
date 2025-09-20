import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-brand-100 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-textdark">{locale === 'ar' ? 'مدونة غاية' : 'Ghaya Insights'}</h1>
        <p className="mt-2 text-sm text-textdark/70">
          {locale === 'ar'
            ? 'مقالات حول السياحة المصرية، نصائح السفر، وأدلة الحج والعمرة.'
            : 'Stories on Egyptian travel, inspiration, and faith journeys.'}
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <img
              src={post.coverImage || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'}
              alt={post.titleEn}
              className="h-40 w-full rounded-2xl object-cover"
            />
            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase text-brand-700">{post.category.title}</p>
              <h2 className="text-lg font-semibold text-textdark">
                {locale === 'ar' ? post.titleAr : post.titleEn}
              </h2>
              <p className="text-sm text-textdark/70">
                {locale === 'ar' ? post.summaryAr : post.summaryEn}
              </p>
              <a
                href={`/${locale}/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-600"
              >
                {locale === 'ar' ? 'اكمل القراءة' : 'Read article'}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
