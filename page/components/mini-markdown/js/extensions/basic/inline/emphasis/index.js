import { EmphasisRule } from "./rule.js";
import { EmphasisRenderer } from "./renderer.js";
import { EmphasisBehavior } from "./behavior.js";

const name = "emphasis";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new EmphasisRule(name),
    priority: {
      major: 10000,
      minor: 5000,
    },
  }],
  renderers: [new EmphasisRenderer(name)],
  behaviors: [new EmphasisBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};