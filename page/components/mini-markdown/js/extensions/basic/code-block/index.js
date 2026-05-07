import { CodeBlockRule } from "./rule.js";
import { CodeBlockRenderer } from "./renderer.js";
import { CodeBlockBehavior } from "./behavior.js";

const name = "code-block";

export default {
  name: name,
  blockRules: [new CodeBlockRule(name)],
  renderers: {
    [name]: new CodeBlockRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new CodeBlockBehavior(name),
  ],
};