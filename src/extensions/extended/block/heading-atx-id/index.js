import { HeadingAtxIdRule } from "./block.js";
import { HeadingAtxIdRenderer } from "./renderer.js";

const name = "heading-atx-id";

export const HeadingAtxId = {
  name: name,
  blocks: [{
    rule: new HeadingAtxIdRule(name),
    priority: { major: 6000, minor: 4000 },
  }],
  renderers: [new HeadingAtxIdRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};