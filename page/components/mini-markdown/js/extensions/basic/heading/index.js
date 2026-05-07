import { HeadingRule } from "./rule.js";
import { HeadingRenderer } from "./renderer.js";
import { HeadingBehavior } from "./behavior.js";

const name = "heading";

export default {
  name: name,
  blockRules: [new HeadingRule(name)],
  renderers: {
    [name]: new HeadingRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new HeadingBehavior(name),
  ],
};