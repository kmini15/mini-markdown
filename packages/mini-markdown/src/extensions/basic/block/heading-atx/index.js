import { HeadingAtxRule } from "./block.js";
import { HeadingAtxRenderer } from "./renderer.js";

const name = "heading-atx";

export const HeadingAtx = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new HeadingAtxRule(name),
  }],
  renderers: [new HeadingAtxRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};