import { GridRule, GridItemRule } from "./block.js";
import { GridRenderer, GridItemRenderer } from "./renderer.js";

const name = "grid";

export default {
  name: name,
  blocks: [{
    rule: new GridRule(name),
    priority: { major: 4500, minor: 5000 },
  }, {
    rule: new GridItemRule(name + "-item"),
    priority: { major: 4500, minor: 5000 },
  }],
  renderers: [new GridRenderer(name), new GridItemRenderer(name + "-item")],
  styles: [new URL("./style.css", import.meta.url).href],
};