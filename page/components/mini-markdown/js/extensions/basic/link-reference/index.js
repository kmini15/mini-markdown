import { LinkReferenceRule } from "./rule.js";
import { LinkReferenceRenderer } from "./renderer.js";
import { LinkReferenceBehavior } from "./behavior.js";

const name = "link-reference";

export default {
  name: name,
  blockRules: [new LinkReferenceRule(name)],
  renderers: {
    [name]: new LinkReferenceRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new LinkReferenceBehavior(name),
  ],
};