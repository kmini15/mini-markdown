import { HardBreakRule } from "./inline.js";
import { HardBreakRenderer } from "./renderer.js";

const name = "hard-break";

export default {
  name: name,
  inlines: [{
    rule: new HardBreakRule(name),
    priority: { major: 1000, minor: 5000 },
  }],
  renderers: [new HardBreakRenderer(name)],
};