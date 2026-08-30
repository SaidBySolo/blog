import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { useRecentPosts, categoryLabel, getAuthor } from "~/utils";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default component$(() => {
  const posts = useRecentPosts();
  const recent = posts.value.slice(0, 5);
  const author = getAuthor("SaidBySolo");

  return (
    <div class="mx-auto w-full max-w-3xl px-4 py-10">
      {/* 소개 섹션 */}
      <section class="flex items-center gap-4 mb-12">
        {author?.avatar && (
          <img
            src={author.avatar}
            alt={author.name}
            width={64}
            height={64}
            class="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h1 class="text-2xl font-bold tracking-tight">SaidBySolo</h1>
          <p class="mt-1 text-sm text-base-content/60">{author?.bio ?? "개발 블로그"}</p>
          {author?.github && (
            <a
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-block text-xs text-base-content/50 hover:text-base-content transition-colors"
            >
              GitHub →
            </a>
          )}
        </div>
      </section>

      {/* 최근 글 */}
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">최근 글</h2>
          <Link
            href="/posts"
            class="text-xs text-base-content/50 hover:text-base-content transition-colors"
          >
            전체 보기 →
          </Link>
        </div>

        <ul class="divide-y divide-base-200">
          {recent.map((post) => (
            <li key={`${post.category}/${post.slug}`}>
              <Link
                href={`/${post.category}/${post.slug}`}
                class="group flex flex-col gap-1 py-4"
              >
                <span class="text-xs text-base-content/50">
                  {categoryLabel(post.category)}
                </span>
                <span class="text-base font-medium group-hover:underline underline-offset-4">
                  {post.frontmatter.title || post.slug}
                </span>
                <span class="text-xs text-base-content/50">
                  {post.frontmatter.author} · {formatDate(post.frontmatter.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "SaidBySolo",
};

export { useRecentPosts };
