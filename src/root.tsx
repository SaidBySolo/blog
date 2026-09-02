import { component$, isDev } from "@qwik.dev/core";
import { RouterOutlet, useQwikRouter } from "@qwik.dev/router";
import { RouterHead } from "./components/router-head/router-head";
import { themeScript } from "./components/ThemeToggle";

import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "katex/dist/katex.min.css";
import "./global.css";

export default component$(() => {
  useQwikRouter();

  return (
    <>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="SaidBySolo's Blog - 개발과 일상을 기록합니다" />
        <meta name="author" content="SaidBySolo" />
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        <script dangerouslySetInnerHTML={themeScript} />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </>
  );
});
