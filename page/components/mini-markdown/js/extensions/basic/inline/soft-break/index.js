import { SoftBreakRule } from "./rule.js";
import { SoftBreakRenderer } from "./renderer.js";
import { SoftBreakBehavior } from "./behavior.js";

const name = "soft-break";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new SoftBreakRule(name),
    priority: {
      major: 2000,
      minor: 5000,
    },
  }],
  renderers: [new SoftBreakRenderer(name)],
  behaviors: [new SoftBreakBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};