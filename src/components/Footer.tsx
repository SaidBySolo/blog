import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="border-t border-base-200">
      <div class="mx-auto flex max-w-3xl items-center justify-center px-4 py-8 text-xs text-base-content/50">
        <p>
          Made with ❤️ by{" "}
          <a
            class="hover:text-base-content transition-colors underline underline-offset-2"
            href="https://github.com/SaidBySolo"
            target="_blank"
            rel="noopener noreferrer"
          >
            SaidBySolo
          </a>{" "}
          · Powered by{" "}
          <a
            href="https://qwik.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-base-content transition-colors underline underline-offset-2"
          >
            Qwik
          </a>{" "}
          &{" "}
          <a
            href="https://daisyui.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-base-content transition-colors underline underline-offset-2"
          >
            daisyUI
          </a>
        </p>
      </div>
    </footer>
  );
})