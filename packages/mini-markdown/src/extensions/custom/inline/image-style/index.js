import { ImageStyleRule } from "./inline.js";
import { ImageStyleRenderer } from "./renderer.js";

const name = "image-style";

export const ImageStyle = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"], before: ["image"] },
    rule: new ImageStyleRule(name),
  }],
  renderers: [new ImageStyleRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};