import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { SunIcon, MoonIcon } from "lucide-qwik";

/**
 * head에 넣는 인라인 스크립트 — 하이드레이션 전에 테마를 적용해 번쩍임을 방지합니다.
 */
export const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem("theme");
    var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default component$(() => {
  const isDark = useSignal(false);

  // 클라이언트에서 초기 테마를 읽어 체크박스 상태를 맞춥니다.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    isDark.value = document.documentElement.dataset.theme === "dark";
  });

  return (
    <label class="swap swap-rotate btn btn-ghost btn-sm btn-circle" aria-label="Toggle theme">
      <input
        type="checkbox"
        checked={isDark.value}
        onChange$={(e) => {
          const dark = (e.target as HTMLInputElement).checked;
          isDark.value = dark;
          const theme = dark ? "dark" : "light";
          document.documentElement.dataset.theme = theme;
          document.documentElement.classList.toggle("dark", dark);
          localStorage.setItem("theme", theme);
        }}
      />
      <SunIcon class="swap-off h-4.5 w-4.5" />
      <MoonIcon class="swap-on h-4.5 w-4.5" />
    </label>
  );
});
