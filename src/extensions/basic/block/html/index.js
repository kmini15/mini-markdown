import { HtmlRule } from "./rule.js";
import { HtmlRenderer } from "./renderer.js";
import { HtmlBehavior } from "./behavior.js";

const name = "html";

export default {
  name: name,
  blockRules: [{
    rule: new HtmlRule(name),
    priority: {
      major: 5000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new HtmlRenderer(name)],
  behaviors: [new HtmlBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};