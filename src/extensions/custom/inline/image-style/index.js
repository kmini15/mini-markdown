import { ImageStyleRule } from "./inline.js";
import { ImageStyleRenderer } from "./renderer.js";

const name = "image-style";

export default {
  name: name,
  inlines: [{
    rule: new ImageStyleRule(name),
    priority: { major: 5000, minor: 4000 },
  }],
  renderers: [new ImageStyleRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};