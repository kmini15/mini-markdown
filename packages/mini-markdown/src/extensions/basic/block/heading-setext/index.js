import { HeadingSetextRule } from "./block.js";
import { HeadingSetextRenderer } from "./renderer.js";

const name = "heading-setext";

export const HeadingSetext = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new HeadingSetextRule(name),
  }],
  renderers: [new HeadingSetextRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};