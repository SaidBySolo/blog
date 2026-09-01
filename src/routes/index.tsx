import { component$ } from "@qwik.dev/core";
import { type DocumentHead } from "@qwik.dev/router";
import { useRecentPosts, categoryLabel } from "~/utils";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default component$(() => {
  const posts = useRecentPosts();

  return (
    <div class="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Recent posts */}
      <section class="flex flex-col">
        {posts.value.map((post) => (
          <a
            key={`${post.category}/${post.slug}`}
            href={`/${post.category}/${post.slug}/`}
            class="group border-b border-base-200 py-10"
          >
            <h2 class="mb-1 text-xl font-semibold tracking-tight group-hover:underline md:text-2xl">
              {post.frontmatter.title || post.slug}
            </h2>
            <h3 class="text-sm text-base-content/50">
              {categoryLabel(post.category)} · {formatDate(post.frontmatter.date)}
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

export const head: DocumentHead = {
  title: "SaidBySolo",
};

export { useRecentPosts };
