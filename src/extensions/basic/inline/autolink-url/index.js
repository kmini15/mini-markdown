import { AutolinkUrlRule } from "./inline.js";
import { AutolinkUrlRenderer } from "./renderer.js";

const name = "autolink-url";

export default {
  name: name,
  inlines: [{
    rule: new AutolinkUrlRule(name),
    priority: { major: 8000, minor: 5000 },
  }],
  renderers: [new AutolinkUrlRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};