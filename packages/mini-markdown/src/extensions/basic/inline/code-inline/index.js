import { CodeInlineRule } from "./inline.js";
import { CodeInlineRenderer } from "./renderer.js";

const name = "code-inline";

export const CodeInline = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new CodeInlineRule(name),
  }],
  renderers: [new CodeInlineRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};