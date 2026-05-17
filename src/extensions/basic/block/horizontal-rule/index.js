import { HorizontalRuleRule } from "./block.js";
import { HorizontalRuleRenderer } from "./renderer.js";

const name = "horizontal-rule";

export const HorizontalRule = {
  name: name,
  blocks: [{
    rule: new HorizontalRuleRule(name),
    priority: { major: 8000, minor: 5000 },
  }],
  renderers: [new HorizontalRuleRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};