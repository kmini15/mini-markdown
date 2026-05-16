import { DocumentRule } from "./block.js";
import { DocumentRenderer } from "./renderer.js";

const name = "document";

export default {
  name: name,
  blocks: [{
    rule: new DocumentRule(name),
    priority: { major: 1000, minor: 5000 },
  }],
  renderers: [new DocumentRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};