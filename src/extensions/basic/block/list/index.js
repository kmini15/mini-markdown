import { ListRule, ListItemRule } from "./block.js";
import { ListRenderer, ListItemRenderer } from "./renderer.js";

const name = "list";

export default {
  name: name,
  blocks: [{
    rule: new ListRule(name),
    priority: {
      major: 4000,
      minor: 5000,
    },
  }, {
    rule: new ListItemRule(name + "-item"),
    priority: {
      major: 4000,
      minor: 5000,
    },
  }],
  renderers: [new ListRenderer(name), new ListItemRenderer(name + "-item")],
  styles: [new URL("./style.css", import.meta.url).href],
};