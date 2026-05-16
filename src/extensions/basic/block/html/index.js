import { HtmlRule } from "./block.js";
import { HtmlRenderer } from "./renderer.js";

const name = "html";

export default {
  name: name,
  blocks: [{
    rule: new HtmlRule(name),
    priority: { major: 5000, minor: 5000 },
  }],
  renderers: [new HtmlRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};