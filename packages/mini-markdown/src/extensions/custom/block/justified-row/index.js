import { JustifiedRowRule, JustifiedRowItemRule } from "./block.js";
import { JustifiedRowRenderer, JustifiedRowItemRenderer } from "./renderer.js";
import { JustifiedRowBehavior } from "./behavior.js";

const name = "justified-row";

export const JustifiedRow = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new JustifiedRowRule(name),
  }, {
    name: name + "-item",
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new JustifiedRowItemRule(name + "-item"),
  }],
  renderers: [new JustifiedRowRenderer(name), new JustifiedRowItemRenderer(name + "-item")],
  behaviors: [new JustifiedRowBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};