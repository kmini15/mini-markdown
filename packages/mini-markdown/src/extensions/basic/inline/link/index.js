import { LinkRule } from "./inline.js";
import { LinkRenderer } from "./renderer.js";

const name = "link";

export const Link = {
  name: name,
  inlines: [{
    rule: new LinkRule(name),
    priority: { major: 6000, minor: 5000 },
  }],
  renderers: [new LinkRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};