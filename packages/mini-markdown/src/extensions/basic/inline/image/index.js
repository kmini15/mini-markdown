import { ImageRule } from "./inline.js";
import { ImageRenderer } from "./renderer.js";

const name = "image";

export const Image = {
  name: name,
  inlines: [{
    name: name,
    order: { after: ["escape"], before: ["link"] },
    rule: new ImageRule(name),
  }],
  renderers: [new ImageRenderer(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};