import { CodeBlockRule } from "./block.js";
import { CodeBlockRenderer } from "./renderer.js";

const name = "code-block";

export default {
  name: name,
  blocks: [{
    rule: new CodeBlockRule(name),
    priority: { major: 2000, minor: 5000 },
  }],
  renderers: [new CodeBlockRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};