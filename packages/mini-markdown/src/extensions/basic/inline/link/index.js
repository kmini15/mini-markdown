import { LinkRule } from "./inline.js";
import { LinkRenderer } from "./renderer.js";

const name = "link";

export const Link = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new LinkRule(name),
  }],
  renderers: [new LinkRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};