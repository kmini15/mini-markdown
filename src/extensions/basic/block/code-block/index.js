import { CodeBlockRule } from "./rule.js";
import { CodeBlockRenderer } from "./renderer.js";
import { CodeBlockBehavior } from "./behavior.js";

const name = "code-block";

export default {
  name: name,
  blockRules: [{
    rule: new CodeBlockRule(name),
    priority: {
      major: 2000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new CodeBlockRenderer(name)],
  behaviors: [new CodeBlockBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};