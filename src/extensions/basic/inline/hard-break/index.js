import { HardBreakRule } from "./rule.js";
import { HardBreakRenderer } from "./renderer.js";
import { HardBreakBehavior } from "./behavior.js";

const name = "hard-break";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new HardBreakRule(name),
    priority: {
      major: 1000,
      minor: 5000,
    },
  }],
  renderers: [new HardBreakRenderer(name)],
  behaviors: [new HardBreakBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};