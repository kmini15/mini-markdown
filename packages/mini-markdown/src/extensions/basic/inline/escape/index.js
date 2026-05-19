import { EscapeRule } from "./inline.js";
import { EscapeRenderer } from "./renderer.js";

const name = "escape";

export const Escape = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["hard-break", "soft-break"] },
    rule: new EscapeRule(name),
  }],
  renderers: [new EscapeRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};