import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { GithubIcon } from "lucide-qwik";
import ThemeToggle from "./ThemeToggle";
import { CATEGORY_LABELS } from "~/utils";

export default component$(() => {
  const loc = useLocation();
  const pathname = loc.url.pathname;

  const linkClass = (href: string) => {
    const active =
      href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `px-3 py-2 text-sm whitespace-nowrap transition-colors ${active
      ? "font-semibold text-base-content"
      : "text-base-content/60 hover:text-base-content"
      }`;
  };

  return (
    <header class="sticky top-0 z-50 border-b border-base-200 bg-base-100/95 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" class="text-base font-bold tracking-tight">
          Blog
        </Link>

        <nav class="flex items-center gap-1">
          <Link href="/" class={linkClass("/")}>Home</Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link key={key} href={`/${key}`} class={linkClass(`/${key}`)}>
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/SaidBySolo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="btn btn-ghost btn-sm btn-circle"
          >
            <GithubIcon class="h-4.5 w-4.5" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
});