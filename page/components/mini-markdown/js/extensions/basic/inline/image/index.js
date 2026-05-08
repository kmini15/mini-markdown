import { ImageRule } from "./rule.js";
import { ImageRenderer } from "./renderer.js";
import { ImageBehavior } from "./behavior.js";

const name = "image";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new ImageRule(name),
    priority: {
      major: 5000,
      minor: 5000,
    },
  }],
  renderers: [new ImageRenderer(name)],
  behaviors: [new ImageBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};