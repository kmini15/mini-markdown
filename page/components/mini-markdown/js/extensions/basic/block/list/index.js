import { ListRule, ListItemRule } from "./rule.js";
import { ListRenderer, ListItemRenderer } from "./renderer.js";
import { ListBehavior } from "./behavior.js";

const name = "list";

export default {
  name: name,
  blockRules: [{
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
  inlineRules: [],
  renderers: [new ListRenderer(name), new ListItemRenderer(name + "-item")],
  behaviors: [new ListBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};