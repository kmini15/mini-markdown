import { ImageStyleRule } from "./rule.js";
import { ImageStyleRenderer } from "./renderer.js";
import { ImageStyleBehavior } from "./behavior.js";

const name = "image-style";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new ImageStyleRule(name),
    priority: {
      major: 5000,
      minor: 4000,
    },
  }],
  renderers: [new ImageStyleRenderer(name)],
  behaviors: [new ImageStyleBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};