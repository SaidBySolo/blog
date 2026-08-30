/**
 * remarkDiscordTimestamp
 *
 * MDX 본문에서 [t:UNIX] 또는 [t:UNIX:FORMAT] 문법을 찾아
 * <DiscordTimestamp unix={UNIX} format="FORMAT" /> 으로 자동 변환합니다.
 *
 * 사용 예)
 *   점검은 [t:1741046400:F] 에 시작됩니다.
 *   마지막 업데이트: [t:1741046400:R]
 *
 * 포맷 코드: t T d D f F R (Discord 타임스탬프 포맷과 동일)
 * 포맷 생략 시 기본값 'f' (짧은 날짜+시간)
 */

import { visit, SKIP } from 'unist-util-visit';
import type { Root, Text, Parent } from 'mdast';

const IMPORT_PATH = '/src/components/DiscordTimestamp';
const COMPONENT_NAME = 'DiscordTimestamp';
const TS_REGEX = /\[t:(\d+)(?::([tTdDfFR]))?\]/g;

function makeImportNode() {
  return {
    type: 'mdxjsEsm',
    value: `import ${COMPONENT_NAME} from '${IMPORT_PATH}'`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: { type: 'Identifier', name: COMPONENT_NAME },
              },
            ],
            source: {
              type: 'Literal',
              value: IMPORT_PATH,
              raw: `'${IMPORT_PATH}'`,
            },
          },
        ],
      },
    },
  };
}

function makeTimestampNode(unix: string, format?: string) {
  const attributes: any[] = [
    {
      type: 'mdxJsxAttribute',
      name: 'unix',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: unix,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: { type: 'Literal', value: Number(unix), raw: unix },
              },
            ],
          },
        },
      },
    },
  ];

  if (format) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'format',
      value: format,
    });
  }

  return {
    type: 'mdxJsxTextElement',
    name: COMPONENT_NAME,
    attributes,
    children: [],
  };
}

export function remarkDiscordTimestamp() {
  return (tree: Root) => {
    let needsImport = false;
    const alreadyImported = JSON.stringify(tree).includes(IMPORT_PATH);

    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;

      const parts: any[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      TS_REGEX.lastIndex = 0;

      while ((match = TS_REGEX.exec(node.value)) !== null) {
        const [full, unix, format] = match;

        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        parts.push(makeTimestampNode(unix, format));
        needsImport = true;
        lastIndex = match.index + full.length;
      }

      if (parts.length === 0) return;

      if (lastIndex < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...parts);
      return [SKIP, index + parts.length];
    });

    if (needsImport && !alreadyImported) {
      tree.children.unshift(makeImportNode() as any);
    }
  };
}
