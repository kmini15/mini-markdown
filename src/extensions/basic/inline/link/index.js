import { LinkRule } from "./rule.js";
import { LinkRenderer } from "./renderer.js";
import { LinkBehavior } from "./behavior.js";

const name = "link";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new LinkRule(name),
    priority: {
      major: 6000,
      minor: 5000,
    },
  }],
  renderers: [new LinkRenderer(name)],
  behaviors: [new LinkBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};