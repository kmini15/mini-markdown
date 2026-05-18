import { SoftBreakRule } from "./inline.js";
import { SoftBreakRenderer } from "./renderer.js";

const name = "soft-break";

export const SoftBreak = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["hard-break"] },
    rule: new SoftBreakRule(name),
  }],
  renderers: [new SoftBreakRenderer(name)],
};