import { ImageRule } from "./inline.js";
import { ImageRenderer } from "./renderer.js";

const name = "image";

export default {
  name: name,
  inlines: [{
    rule: new ImageRule(name),
    priority: { major: 5000, minor: 5000 },
  }],
  renderers: [new ImageRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};