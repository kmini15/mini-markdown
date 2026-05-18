import { BlockquoteRule } from "./block.js";
import { BlockquoteRenderer } from "./renderer.js";

const name = "blockquote";

export const Blockquote = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new BlockquoteRule(name),
  }],
  renderers: [new BlockquoteRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};