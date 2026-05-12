import { LinkCitationRule } from "./rule.js";
import { LinkCitationRenderer } from "./renderer.js";
import { LinkCitationBehavior } from "./behavior.js";

const name = "link-citation";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new LinkCitationRule(name),
    priority: {
      major: 7000,
      minor: 5000,
    },
  }],
  renderers: [new LinkCitationRenderer(name)],
  behaviors: [new LinkCitationBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};