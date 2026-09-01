/**
 * WHAT IS THIS FILE?
 *
 * SSR renderer function, used by Qwik Router.
 *
 * Note that this is the only place the Qwik renderer is called.
 * On the client, containers resume and do not call render.
 */
import { createRenderer } from "@qwik.dev/router";
import Root from "./root";

export default createRenderer((opts) => {
  const frontmatter = (opts.serverData?.frontmatter || {}) as { lang?: string };
  const lang = frontmatter.lang || "ko";

  return {
    jsx: <Root />,
    options: {
      ...opts,
      // Use container attributes to set attributes on the html tag.
      containerAttributes: {
        lang,
        ...opts.containerAttributes,
      },
      serverData: {
        frontmatter,
        ...opts.serverData,
      },
    },
  };
});
