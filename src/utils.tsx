import { routeLoader$ } from "@builder.io/qwik-city";
import authorsJson from '../contents/authors.json';
import categoriesJson from '../contents/categories.json';

export interface Author {
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
  github?: string;
}

export const AUTHORS: Author[] = authorsJson as Author[];

export const CATEGORY_LABELS: Record<string, string> = categoriesJson;

export function categoryLabel(key: string): string {
  return CATEGORY_LABELS[key] ?? key;
}

/** frontmatter.author 문자열로 Author 객체를 찾습니다 (대소문자 무시) */
export const AUTHORS_MAP: Record<string, Author> = Object.fromEntries(
  AUTHORS.map((a) => [a.name.toLowerCase(), a])
);

export function getAuthor(name: string): Author | undefined {
  return AUTHORS_MAP[name?.toLowerCase()] ?? AUTHORS.find((a) => a.name === name);
}

interface PostModule {
  frontmatter: FrontMatter;
  default: any;
};

interface PostMetadata {
  slug: string;
  frontmatter: FrontMatter;
}

export interface FrontMatter {
  title: string;
  date: string;
  author: string;
  description?: string;
  image?: string;
}

interface PostList {
  category: string;
  posts: PostMetadata[];
}

export const BLOG_POST_LIST = import.meta.glob('../contents/*/**/index.mdx', { eager: true });

export interface RecentPost {
  category: string;
  slug: string;
  frontmatter: FrontMatter;
}

// eslint-disable-next-line qwik/loader-location
export const useRecentPosts = routeLoader$((): RecentPost[] => {
  return Object.entries(BLOG_POST_LIST)
    .map(([key, mod]) => {
      const parts = key.split('/');
      return {
        category: parts[2],
        slug: parts[3],
        frontmatter: (mod as PostModule).frontmatter,
      };
    })
    .filter((p) => p.frontmatter?.date)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
});

// eslint-disable-next-line qwik/loader-location
export const usePostList = routeLoader$(({ params, exit }): PostList => {
  const { category } = params;

  const path = `../contents/${category}/`;

  const filterdMetadata = Object.keys(BLOG_POST_LIST)
    .filter((key) => key.startsWith(path))
    .map((key) => {
      const mod = BLOG_POST_LIST[key] as PostModule;
      const frontmatter = mod.frontmatter
      return {
        slug: key.split('/')[3],
        frontmatter,
      };
    });

  if (filterdMetadata.length === 0) {
    throw exit()
  }
  return {
    category,
    posts: filterdMetadata,
  };
});

// eslint-disable-next-line qwik/loader-location
export const usePost = routeLoader$(({ params, exit }) => {
  const { category, slug } = params;

  const path = `../contents/${category}/${slug}/index.mdx`;

  const mod = BLOG_POST_LIST[path] as PostModule | undefined;
  if (!mod) {
    throw exit();
  }

  return {
    frontmatter: mod.frontmatter,
  }
});