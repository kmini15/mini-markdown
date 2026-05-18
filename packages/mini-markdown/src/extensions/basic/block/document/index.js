import { DocumentRule } from "./block.js";
import { DocumentRenderer } from "./renderer.js";

const name = "document";

export const Document = {
  name: name,
  blocks: [{
    name: name,
    order: { before: ["paragraph"] },
    rule: new DocumentRule(name),
  }],
  renderers: [new DocumentRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};