import { FencedCodeBlockRule } from "./block.js";
import { FencedCodeBlockRenderer } from "./renderer.js";

const name = "fenced-code-block";

export const FencedCodeBlock = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new FencedCodeBlockRule(name),
  }],
  renderers: [new FencedCodeBlockRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};