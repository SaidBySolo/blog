
import { component$ } from '@qwik.dev/core';
import { Link, useLocation, type StaticGenerateHandler } from '@qwik.dev/router';
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
        <Link
          href={`/${category}`}
          class="text-xs text-base-content/50 hover:text-base-content transition-colors"
        >
          ← {categoryLabel(category)}
        </Link>
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


export const head = ({ resolveValue }: { resolveValue: (fn: (v: { frontmatter: FrontMatter }) => any) => any }) => {
  const fm = resolveValue(usePost).frontmatter;
  return {
    title: fm.title,
    meta: [
      { name: "description", content: fm.title },
      { property: "og:type", content: "article" },
    ],
  };
};


export { usePost };