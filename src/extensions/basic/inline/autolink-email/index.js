import { AutolinkEmailRule } from "./inline.js";
import { AutolinkEmailRenderer } from "./renderer.js";

const name = "autolink-email";

export default {
  name: name,
  inlines: [{
    rule: new AutolinkEmailRule(name),
    priority: { major: 9000, minor: 5000 },
  }],
  renderers: [new AutolinkEmailRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};