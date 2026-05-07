import { JustifiedRowRule, JustifiedRowItemRule } from "./rule.js";
import { JustifiedRowRenderer, JustifiedRowItemRenderer } from "./renderer.js";
import { JustifiedRowBehavior } from "./behavior.js";

const name = "justified-row";

export default {
  name: name,
  blockRules: [
    new JustifiedRowRule(name),
    new JustifiedRowItemRule(name + "-item"),
  ],
  renderers: {
    [name]: new JustifiedRowRenderer(name),
    [name + "-item"]: new JustifiedRowItemRenderer(name + "-item"),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new JustifiedRowBehavior(name),
  ],
};