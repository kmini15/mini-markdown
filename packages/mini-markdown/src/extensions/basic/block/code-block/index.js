import { CodeBlockRule } from "./block.js";
import { CodeBlockRenderer } from "./renderer.js";

const name = "code-block";

export const CodeBlock = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["document"], before: ["paragraph"] },
    rule: new CodeBlockRule(name),
  }],
  renderers: [new CodeBlockRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};