import { FencedCodeBlockRule } from "./block.js";
import { FencedCodeBlockRenderer } from "./renderer.js";

const name = "fenced-code-block";

export default {
  name: name,
  blocks: [{
    rule: new FencedCodeBlockRule(name),
    priority: { major: 4500, minor: 6000 },
  }],
  renderers: [new FencedCodeBlockRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};