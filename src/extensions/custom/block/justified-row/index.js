import { JustifiedRowRule, JustifiedRowItemRule } from "./block.js";
import { JustifiedRowRenderer, JustifiedRowItemRenderer } from "./renderer.js";
import { JustifiedRowBehavior } from "./behavior.js";

const name = "justified-row";

export default {
  name: name,
  blocks: [{
    rule: new JustifiedRowRule(name),
    priority: { major: 4500, minor: 5500 },
  }, {
    rule: new JustifiedRowItemRule(name + "-item"),
    priority: { major: 4500, minor: 5500 },
  }],
  renderers: [new JustifiedRowRenderer(name), new JustifiedRowItemRenderer(name + "-item")],
  behaviors: [new JustifiedRowBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};