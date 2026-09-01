
import { component$ } from '@qwik.dev/core';
import { useLocation, type StaticGenerateHandler } from '@qwik.dev/router';
import { usePost, BLOG_POST_LIST, getAuthor, categoryLabel } from '~/utils';
import type { FrontMatter } from '~/utils';

export const onStaticGenerate: StaticGenerateHandler = () => {
  const params = Object.keys(BLOG_POST_LIST).map((key) => {
    // key 형식: ../contents/{category}/{slug}/index.mdx
    const parts = key.split('/');
    return { category: parts[2], slug: parts[3] };
  });
  return { params };
};

export default component$(() => {
  const mod = usePost();
  const loc = useLocation();
  const { category, slug } = loc.params;
  const path = `../contents/${category}/${slug}/index.mdx`;
  const mdxModule = BLOG_POST_LIST[path] as { default: any } | undefined;
  const MDX = mdxModule?.default;
  const frontmatter = mod.value.frontmatter;
  const date = new Date(frontmatter.date);

  const author = getAuthor(frontmatter.author);

  return (
    <>
      <div class="not-prose">
        <a
          href={`/${category}/`}
          class="text-xs text-base-content/50 hover:text-base-content transition-colors"
        >
          ← {categoryLabel(category)}
        </a>
        <h1 class="text-3xl font-bold tracking-tight mt-2">{frontmatter.title}</h1>
        <div class="flex items-center gap-3 mt-4">
          {author?.avatar ? (
            <img src={author.avatar} alt={author.name} width={36} height={36} class="h-9 w-9 rounded-full" />
          ) : (
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-neutral text-neutral-content text-sm">
              {frontmatter.author?.[0] ?? '?'}
            </span>
          )}
          <div>
            {author?.github ? (
              <a
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-sm leading-tight hover:underline underline-offset-4"
              >
                {frontmatter.author}
              </a>
            ) : (
              <p class="font-semibold text-sm leading-tight">{frontmatter.author}</p>
            )}
            <p class="text-xs text-base-content/50">{`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}</p>
          </div>
        </div>
      </div>
      <hr class="my-6 border-base-200" />
      {MDX && <MDX />}
    </>
  );
});


export const head = ({ resolveValue, params }: {
  resolveValue: (fn: (v: { frontmatter: FrontMatter }) => any) => any;
  params: { category: string; slug: string };
}) => {
  const fm = resolveValue(usePost).frontmatter;
  const canonicalUrl = `https://blog.solo.moe/${params.category}/${params.slug}`;
  const lang = fm.lang || "ko";
  const ogLocale = lang === "en" ? "en_US" : "ko_KR";

  // keywords 생성 (공백, 특수문자 기준으로 단어 분리)
  const keywords = [
    ...(fm.title?.split(/[\s:,·\/\-\(\)]+/).filter(w => w.length > 1) ?? []),
    params.category,
    fm.author
  ].join(", ");

  const meta: Array<{
    name?: string;
    property?: string;
    content?: string
  }> = [
      { name: "description", content: fm.description || fm.title },
      { name: "keywords", content: keywords },
      { name: "author", content: fm.author },
      { property: "og:type", content: "article" },
      { property: "og:title", content: fm.title },
      { property: "og:description", content: fm.description || fm.title },
      { property: "og:url", content: canonicalUrl },
      { property: "og:locale", content: ogLocale },
      { property: "article:published_time", content: new Date(fm.date).toISOString() },
      { property: "article:author", content: fm.author },
      { property: "article:section", content: params.category },
      { name: "twitter:card", content: fm.image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: fm.title },
      { name: "twitter:description", content: fm.description || fm.title },
    ];

  if (fm.image) {
    const imageUrl = fm.image.startsWith('http')
      ? fm.image
      : `https://blog.solo.moe${fm.image.startsWith('/') ? '' : '/'}${fm.image}`;
    meta.push(
      { property: "og:image", content: imageUrl },
      { name: "twitter:image", content: imageUrl },
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description || fm.title,
    datePublished: new Date(fm.date).toISOString(),
    dateModified: new Date(fm.date).toISOString(),
    author: {
      "@type": "Person",
      name: fm.author,
      url: "https://blog.solo.moe",
    },
    publisher: {
      "@type": "Person",
      name: fm.author,
      url: "https://blog.solo.moe",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    ...(fm.image && {
      image: fm.image.startsWith('http')
        ? fm.image
        : `https://blog.solo.moe${fm.image.startsWith('/') ? '' : '/'}${fm.image}`
    }),
  };

  return {
    title: fm.title,
    meta,
    scripts: [
      {
        props: {
          type: "application/ld+json",
          dangerouslySetInnerHTML: JSON.stringify(jsonLd),
        },
      },
    ],
  };
};

export { usePost };
