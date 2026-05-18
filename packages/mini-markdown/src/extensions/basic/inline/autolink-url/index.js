import { AutolinkUrlRule } from "./inline.js";
import { AutolinkUrlRenderer } from "./renderer.js";

const name = "autolink-url";

export const AutolinkUrl = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new AutolinkUrlRule(name),
  }],
  renderers: [new AutolinkUrlRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};