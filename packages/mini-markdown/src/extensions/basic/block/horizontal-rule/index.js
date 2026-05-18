import { HorizontalRuleRule } from "./block.js";
import { HorizontalRuleRenderer } from "./renderer.js";

const name = "horizontal-rule";

export const HorizontalRule = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new HorizontalRuleRule(name),
  }],
  renderers: [new HorizontalRuleRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};