import { CodeRule } from "./rule.js";
import { CodeRenderer } from "./renderer.js";
import { CodeBehavior } from "./behavior.js";

const name = "code";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new CodeRule(name),
    priority: {
      major: 4000,
      minor: 5000,
    },
  }],
  renderers: [new CodeRenderer(name)],
  behaviors: [new CodeBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};