import { CodeInlineRule } from "./inline.js";
import { CodeInlineRenderer } from "./renderer.js";

const name = "code-inline";

export const CodeInline = {
  name: name,
  inlines: [{
    rule: new CodeInlineRule(name),
    priority: { major: 4000, minor: 5000 },
  }],
  renderers: [new CodeInlineRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};