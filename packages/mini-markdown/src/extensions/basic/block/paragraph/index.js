import { ParagraphRule } from "./block.js";
import { ParagraphRenderer } from "./renderer.js";

const name = "paragraph";

export const Paragraph = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["document"] },
    rule: new ParagraphRule(name),
  }],
  renderers: [new ParagraphRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};