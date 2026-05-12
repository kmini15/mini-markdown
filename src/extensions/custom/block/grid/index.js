import { GridRule, GridItemRule } from "./rule.js";
import { GridRenderer, GridItemRenderer } from "./renderer.js";
import { GridBehavior } from "./behavior.js";

const name = "grid";

export default {
  name: name,
  blockRules: [{
    rule: new GridRule(name),
    priority: {
      major: 4500,
      minor: 5000,
    },
  }, {
    rule: new GridItemRule(name + "-item"),
    priority: {
      major: 4500,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new GridRenderer(name), new GridItemRenderer(name + "-item")],
  behaviors: [new GridBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};