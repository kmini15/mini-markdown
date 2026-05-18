import { HeadingAtxIdRule } from "./block.js";
import { HeadingAtxIdRenderer } from "./renderer.js";

const name = "heading-atx-id";

export const HeadingAtxId = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["heading-atx"] },
    rule: new HeadingAtxIdRule(name),
  }],
  renderers: [new HeadingAtxIdRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};