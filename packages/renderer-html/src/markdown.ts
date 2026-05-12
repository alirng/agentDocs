import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import type { Schema } from "hast-util-sanitize";

export function renderMarkdown(markdown: string): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSanitize, agentDocsSanitizeSchema)
      .use(rehypeStringify)
      .processSync(markdown)
  );
}

const agentDocsSanitizeSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
    input: [
      ["type", "checkbox"],
      "checked",
      "disabled"
    ],
    table: [...(defaultSchema.attributes?.table ?? []), ["className"]],
    th: [...(defaultSchema.attributes?.th ?? []), ["align"]],
    td: [...(defaultSchema.attributes?.td ?? []), ["align"]]
  },
  tagNames: [...(defaultSchema.tagNames ?? []), "input"]
};
