import { LinkReferenceRule } from "./rule.js";
import { LinkReferenceRenderer } from "./renderer.js";
import { LinkReferenceBehavior } from "./behavior.js";

const name = "link-reference";

export default {
  name: name,
  blockRules: [{
    rule: new LinkReferenceRule(name),
    priority: {
      major: 9000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new LinkReferenceRenderer(name)],
  behaviors: [new LinkReferenceBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};