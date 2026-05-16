import { HeadingAtxRule } from "./block.js";
import { HeadingAtxRenderer } from "./renderer.js";

const name = "heading-atx";

export default {
  name: name,
  blocks: [{
    rule: new HeadingAtxRule(name),
    priority: { major: 6000, minor: 5000 },
  }],
  renderers: [new HeadingAtxRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};