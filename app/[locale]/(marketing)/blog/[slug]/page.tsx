import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.titleEn,
    description: post.summaryEn,
    openGraph: {
      title: post.titleEn,
      description: post.summaryEn,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

export default async function BlogDetail({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } }
  });
  if (!post) {
    notFound();
  }
  const title = locale === 'ar' ? post.titleAr : post.titleEn;
  const content = locale === 'ar' ? post.contentAr : post.contentEn;

  return (
    <article className="space-y-6 rounded-3xl border border-brand-100 bg-white p-8 shadow-sm">
      <div>
        <p className="text-xs uppercase text-brand-700">{post.category.title}</p>
        <h1 className="text-3xl font-bold text-textdark">{title}</h1>
        <p className="text-sm text-textdark/70">
          {post.publishedAt
            ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', { dateStyle: 'medium' }).format(post.publishedAt)
            : null}
        </p>
      </div>
      {post.coverImage && (
        <img src={post.coverImage} alt={title} className="w-full rounded-2xl object-cover" />
      )}
      <div className="prose max-w-none text-textdark prose-headings:text-textdark prose-a:text-accent ltr:prose-base rtl:prose-base">
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-brand-700">
        {post.tags.map(({ tag }) => (
          <span key={tag.id} className="rounded-full bg-brand-50 px-3 py-1">
            #{tag.title}
          </span>
        ))}
      </div>
    </article>
  );
}
