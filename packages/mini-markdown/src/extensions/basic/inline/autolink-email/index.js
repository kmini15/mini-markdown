import { AutolinkEmailRule } from "./inline.js";
import { AutolinkEmailRenderer } from "./renderer.js";

const name = "autolink-email";

export const AutolinkEmail = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"] },
    rule: new AutolinkEmailRule(name),
  }],
  renderers: [new AutolinkEmailRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};