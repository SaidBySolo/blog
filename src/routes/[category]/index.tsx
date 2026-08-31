import { component$, useSignal, useComputed$ } from '@qwik.dev/core';
import { type StaticGenerateHandler } from '@qwik.dev/router';
import { usePostList, getAuthor, categoryLabel, BLOG_POST_LIST } from '~/utils';

const PAGE_SIZE = 20;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 30) return `${diffDays}일 전`;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
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
  const page = useSignal(1);
  const sortAsc = useSignal(false);

  const sorted = useComputed$(() => {
    const list = posts.value.posts.filter(p => p.frontmatter).slice();
    list.sort((a, b) => {
      const da = new Date(a.frontmatter.date).getTime();
      const db = new Date(b.frontmatter.date).getTime();
      return sortAsc.value ? da - db : db - da;
    });
    return list;
  });

  const totalPages = useComputed$(() => Math.ceil(sorted.value.length / PAGE_SIZE));

  const paged = useComputed$(() => {
    const start = (page.value - 1) * PAGE_SIZE;
    return sorted.value.slice(start, start + PAGE_SIZE);
  });

  return (
    <div class="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 class="text-2xl font-bold tracking-tight mb-8">
        {categoryLabel(posts.value.category)}
      </h1>

      {/* 리스트 */}
      <ul class="divide-y divide-base-200">
        {paged.value.map((post, i) => {
          const author = getAuthor(post.frontmatter.author);
          // 전체 순번 (정렬 기준), 페이지 이동해도 이어지도록 계산
          const index = (page.value - 1) * PAGE_SIZE + i + 1;
          return (
            <li key={post.slug}>
              <a
                href={`/${posts.value.category}/${post.slug}/`}
                class="group flex items-baseline gap-4 py-3"
              >
                <span class="w-8 shrink-0 text-right text-xs text-base-content/40">
                  {index}
                </span>
                <span class="flex-1 truncate text-sm group-hover:underline underline-offset-4">
                  {post.frontmatter.title || post.slug}
                </span>
                <span class="hidden shrink-0 text-xs text-base-content/50 md:block">
                  {author?.name ?? post.frontmatter.author}
                </span>
                <span class="shrink-0 text-xs text-base-content/50">
                  {post.frontmatter.date ? formatDate(post.frontmatter.date) : '-'}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* 페이지네이션 */}
      {totalPages.value > 1 && (
        <div class="flex justify-center gap-1 mt-10">
          <button
            class="btn btn-sm btn-ghost"
            disabled={page.value <= 1}
            onClick$={() => page.value--}
          >«</button>
          {Array.from({ length: totalPages.value }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              class={`btn btn-sm ${p === page.value ? 'btn-neutral' : 'btn-ghost'}`}
              onClick$={() => page.value = p}
            >
              {p}
            </button>
          ))}
          <button
            class="btn btn-sm btn-ghost"
            disabled={page.value >= totalPages.value}
            onClick$={() => page.value++}
          >»</button>
        </div>
      )}
    </div>
  );
});

export { usePostList };
