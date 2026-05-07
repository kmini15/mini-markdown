import { ListRule, ListItemRule } from "./rule.js";
import { ListRenderer, ListItemRenderer } from "./renderer.js";
import { ListBehavior } from "./behavior.js";

const name = "list";

export default {
  name: name,
  blockRules: [
    new ListRule(name),
    new ListItemRule(name + "-item"),
  ],
  renderers: {
    [name]: new ListRenderer(name),
    [name + "-item"]: new ListItemRenderer(name + "-item")
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new ListBehavior(name),
  ],
};