import { SetextHeadingRule } from "./rule.js";
import { SetextHeadingRenderer } from "./renderer.js";
import { SetextHeadingBehavior } from "./behavior.js";

const name = "setext-heading";

export default {
  name: name,
  blockRules: [new SetextHeadingRule(name)],
  renderers: {
    [name]: new SetextHeadingRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new SetextHeadingBehavior(name),
  ],
};