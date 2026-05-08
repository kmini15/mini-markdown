import { BlockquoteRule } from "./rule.js";
import { BlockquoteRenderer } from "./renderer.js";
import { BlockquoteBehavior } from "./behavior.js";

const name = "blockquote";

export default {
  name: name,
  blockRules: [{
    rule: new BlockquoteRule(name),
    priority: {
      major: 3000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new BlockquoteRenderer(name)],
  behaviors: [new BlockquoteBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};