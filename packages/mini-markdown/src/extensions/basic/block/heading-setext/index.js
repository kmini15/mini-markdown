import { HeadingSetextRule } from "./block.js";
import { HeadingSetextRenderer } from "./renderer.js";

const name = "heading-setext";

export const HeadingSetext = {
  name: name,
  blocks: [{
    rule: new HeadingSetextRule(name),
    priority: { major: 7000, minor: 5000 },
  }],
  renderers: [new HeadingSetextRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};