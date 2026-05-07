import { GridRule, GridItemRule } from "./rule.js";
import { GridRenderer, GridItemRenderer } from "./renderer.js";
import { GridBehavior } from "./behavior.js";

const name = "grid";

export default {
  name: name,
  blockRules: [
    new GridRule(name),
    new GridItemRule(`${name}-item`),
  ],
  renderers: {
    [name]: new GridRenderer(name),
    [`${name}-item`]: new GridItemRenderer(`${name}-item`),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new GridBehavior(name),
  ],
};