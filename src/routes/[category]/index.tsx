import { component$ } from '@qwik.dev/core';
import { type StaticGenerateHandler } from '@qwik.dev/router';
import { usePostList, categoryLabel, BLOG_POST_LIST } from '~/utils';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const onStaticGenerate: StaticGenerateHandler = () => {
  const categories = [...new Set(
    Object.keys(BLOG_POST_LIST).map((key) => key.split('/')[2])
  )];
  return { params: categories.map((category) => ({ category })) };
};

export const head = ({ params }: { params: Record<string, string> }) => {
  return { title: categoryLabel(params.category) };
};

export default component$(() => {
  const posts = usePostList();

  const sorted = posts.value.posts
    .filter((p) => p.frontmatter?.date)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return (
    <div class="mx-auto w-full max-w-3xl px-4 py-10">
      <section class="flex flex-col">
        {sorted.map((post) => (
          <a
            key={post.slug}
            href={`/${posts.value.category}/${post.slug}/`}
            class="group border-b border-base-200 py-10"
          >
            <h2 class="mb-1 text-xl font-semibold tracking-tight group-hover:underline md:text-2xl">
              {post.frontmatter.title || post.slug}
            </h2>
            <h3 class="text-sm text-base-content/50">
              {formatDate(post.frontmatter.date)}
            </h3>
            {post.frontmatter.description && (
              <p class="mt-4 text-lg">{post.frontmatter.description}</p>
            )}
          </a>
        ))}
      </section>
    </div>
  );
});

export { usePostList };
