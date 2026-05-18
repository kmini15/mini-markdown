import { ListRule, ListItemRule } from "./block.js";
import { ListRenderer, ListItemRenderer } from "./renderer.js";

const name = "list";

export const List = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new ListRule(name),
  }, {
    name: name + "-item",
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new ListItemRule(name + "-item"),
  }],
  renderers: [new ListRenderer(name), new ListItemRenderer(name + "-item")],
  styles: [new URL("./style.css", import.meta.url).href],
};