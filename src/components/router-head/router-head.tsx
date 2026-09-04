import { component$ } from "@qwik.dev/core";
import { useDocumentHead, useLocation } from "@qwik.dev/router";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  const title = head.title || "SaidBySolo";
  const description =
    head.meta.find((m) => m.name === "description")?.content ??
    "SaidBySolo's Blog - 개발과 일상을 기록합니다";
  const image = head.meta.find((m) => m.property === "og:image")?.content;
  const hasMeta = (attribute: "name" | "property", value: string) =>
    head.meta.some((meta) => meta[attribute] === value);
  const hasCanonical = head.links.some((link) => link.rel === "canonical");

  return (
    <>
      <title>{title}</title>

      {!hasCanonical && <link rel="canonical" href={loc.url.href} />}
      {!hasMeta("name", "description") && (
        <meta name="description" content={description} />
      )}
      {!hasMeta("name", "author") && (
        <meta name="author" content="SaidBySolo" />
      )}

      {/* Open Graph */}
      {!hasMeta("property", "og:type") && (
        <meta property="og:type" content="website" />
      )}
      {!hasMeta("property", "og:title") && (
        <meta property="og:title" content={title} />
      )}
      {!hasMeta("property", "og:description") && (
        <meta property="og:description" content={description} />
      )}
      {!hasMeta("property", "og:url") && (
        <meta property="og:url" content={loc.url.href} />
      )}
      {!hasMeta("property", "og:site_name") && (
        <meta property="og:site_name" content="SaidBySolo" />
      )}
      {!hasMeta("name", "twitter:card") && (
        <meta
          name="twitter:card"
          content={image ? "summary_large_image" : "summary"}
        />
      )}
      {!hasMeta("name", "twitter:title") && (
        <meta name="twitter:title" content={title} />
      )}
      {!hasMeta("name", "twitter:description") && (
        <meta name="twitter:description" content={description} />
      )}

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
