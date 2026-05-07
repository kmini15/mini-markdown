import { HorizontalRuleRule } from "./rule.js";
import { HorizontalRuleRenderer } from "./renderer.js";
import { HorizontalRuleBehavior } from "./behavior.js";

const name = "horizontal-rule";

export default {
  name: name,
  blockRules: [new HorizontalRuleRule(name)],
  renderers: {
    [name]: new HorizontalRuleRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new HorizontalRuleBehavior(name),
  ],
};