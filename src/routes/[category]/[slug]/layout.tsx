import { component$, Slot } from "@qwik.dev/core";

export default component$(() => {
  return (
    <div class="prose prose-neutral dark:prose-invert w-full min-w-0 max-w-3xl px-4 py-10 mx-auto">
      <Slot />
    </div>
  );
});
