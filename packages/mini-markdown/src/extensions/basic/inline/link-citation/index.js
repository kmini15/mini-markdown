import { LinkCitationRule } from "./inline.js";
import { LinkCitationRenderer } from "./renderer.js";

const name = "link-citation";

export const LinkCitation = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new LinkCitationRule(name),
  }],
  renderers: [new LinkCitationRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};