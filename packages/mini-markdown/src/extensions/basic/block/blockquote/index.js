import { BlockquoteRule } from "./block.js";
import { BlockquoteRenderer } from "./renderer.js";

const name = "blockquote";

export const Blockquote = {
  name: name,
  blocks: [{
    rule: new BlockquoteRule(name),
    priority: { major: 3000, minor: 5000 },
  }],
  renderers: [new BlockquoteRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};