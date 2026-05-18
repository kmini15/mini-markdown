import { GridRule, GridItemRule } from "./block.js";
import { GridRenderer, GridItemRenderer } from "./renderer.js";

const name = "grid";

export const Grid = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new GridRule(name),
  }, {
    name: name + "-item",
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new GridItemRule(name + "-item"),
  }],
  renderers: [new GridRenderer(name), new GridItemRenderer(name + "-item")],
  styles: [new URL("./style.css", import.meta.url).href],
};