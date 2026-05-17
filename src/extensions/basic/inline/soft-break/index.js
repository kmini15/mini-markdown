import { SoftBreakRule } from "./inline.js";
import { SoftBreakRenderer } from "./renderer.js";

const name = "soft-break";

export const SoftBreak = {
  name: name,
  inlines: [{
    rule: new SoftBreakRule(name),
    priority: { major: 2000, minor: 5000 },
  }],
  renderers: [new SoftBreakRenderer(name)],
};