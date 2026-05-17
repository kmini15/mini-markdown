import { LinkCitationRule } from "./inline.js";
import { LinkCitationRenderer } from "./renderer.js";

const name = "link-citation";

export const LinkCitation = {
  name: name,
  inlines: [{
    rule: new LinkCitationRule(name),
    priority: { major: 7000, minor: 5000 },
  }],
  renderers: [new LinkCitationRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};