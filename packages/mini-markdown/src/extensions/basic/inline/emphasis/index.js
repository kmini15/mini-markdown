import { EmphasisRule } from "./inline.js";
import { EmphasisRenderer } from "./renderer.js";

const name = "emphasis";

export const Emphasis = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new EmphasisRule(name),
  }],
  renderers: [new EmphasisRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};