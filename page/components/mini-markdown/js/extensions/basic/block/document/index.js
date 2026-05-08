import { DocumentRule } from "./rule.js";
import { DocumentRenderer } from "./renderer.js";
import { DocumentBehavior } from "./behavior.js";

const name = "document";

export default {
  name: name,
  blockRules: [{
    rule: new DocumentRule(name),
    priority: {
      major: 1000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new DocumentRenderer(name)],
  behaviors: [new DocumentBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};