import { BlockquoteRule } from "./rule.js";
import { BlockquoteRenderer } from "./renderer.js";
import { BlockquoteBehavior } from "./behavior.js";

const name = "blockquote";

export default {
  name: name,
  blockRules: [new BlockquoteRule(name)],
  renderers: {
    [name]: new BlockquoteRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new BlockquoteBehavior(name),
  ],
};