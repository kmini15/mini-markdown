import { HorizontalRuleRule } from "./rule.js";
import { HorizontalRuleRenderer } from "./renderer.js";
import { HorizontalRuleBehavior } from "./behavior.js";

const name = "horizontal-rule";

export default {
  name: name,
  blockRules: [{
    rule: new HorizontalRuleRule(name),
    priority: {
      major: 8000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new HorizontalRuleRenderer(name)],
  behaviors: [new HorizontalRuleBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};