import { ParagraphRule } from "./block.js";
import { ParagraphRenderer } from "./renderer.js";

const name = "paragraph";

export default {
  name: name,
  blocks: [{
    rule: new ParagraphRule(name),
    priority: { major: 10000, minor: 5000 },
  }],
  renderers: [new ParagraphRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};