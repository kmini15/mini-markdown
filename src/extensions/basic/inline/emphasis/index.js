import { EmphasisRule } from "./inline.js";
import { EmphasisRenderer } from "./renderer.js";

const name = "emphasis";

export default {
  name: name,
  inlines: [{
    rule: new EmphasisRule(name),
    priority: { major: 10000, minor: 5000 },
  }],
  renderers: [new EmphasisRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};