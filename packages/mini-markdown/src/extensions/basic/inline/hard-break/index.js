import { HardBreakRule } from "./inline.js";
import { HardBreakRenderer } from "./renderer.js";

const name = "hard-break";

export const HardBreak = {
  name: name,
  inlines: [{
    name: name,
    order: { before: ["soft-break"] },
    rule: new HardBreakRule(name),
  }],
  renderers: [new HardBreakRenderer(name)],
};