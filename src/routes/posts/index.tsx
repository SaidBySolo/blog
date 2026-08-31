import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { useRecentPosts, categoryLabel, getAuthor } from "~/utils";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default component$(() => {
  const posts = useRecentPosts();

  return (
    <div class="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 class="text-2xl font-bold tracking-tight mb-8">All Posts</h1>

      <ul class="divide-y divide-base-200">
        {posts.value.map((post, i) => (
          <li key={`${post.category}/${post.slug}`}>
            <a
              href={`/${post.category}/${post.slug}/`}
              class="group flex items-baseline gap-4 py-3"
            >
              <span class="w-8 shrink-0 text-right text-xs text-base-content/40">
                {i + 1}
              </span>
              <span class="flex-1 truncate text-sm group-hover:underline underline-offset-4">
                {post.frontmatter.title || post.slug}
              </span>
              <span class="shrink-0 text-xs text-base-content/50">
                {categoryLabel(post.category)}
              </span>
              <span class="hidden shrink-0 text-xs text-base-content/50 md:block">
                {getAuthor(post.frontmatter.author)?.name ?? post.frontmatter.author}
              </span>
              <span class="shrink-0 text-xs text-base-content/50">
                {post.frontmatter.date ? formatDate(post.frontmatter.date) : '-'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const head: DocumentHead = {
  title: "All Posts · SaidBySolo",
};

export { useRecentPosts };
