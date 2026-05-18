import { HtmlRule } from "./block.js";
import { HtmlRenderer } from "./renderer.js";

const name = "html";

export const Html = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new HtmlRule(name),
  }],
  renderers: [new HtmlRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};