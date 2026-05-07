import { DocumentRule } from "./rule.js";
import { DocumentRenderer } from "./renderer.js";
import { DocumentBehavior } from "./behavior.js";

const name = "document";

export default {
  name: name,
  blockRules: [new DocumentRule(name)],
  renderers: {
    [name]: new DocumentRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new DocumentBehavior(name),
  ],
};