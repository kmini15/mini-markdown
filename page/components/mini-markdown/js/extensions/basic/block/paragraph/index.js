import { ParagraphRule } from "./rule.js";
import { ParagraphRenderer } from "./renderer.js";
import { ParagraphBehavior } from "./behavior.js";

const name = "paragraph";

export default {
  name: name,
  blockRules: [{
    rule: new ParagraphRule(name),
    priority: {
      major: 10000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new ParagraphRenderer(name)],
  behaviors: [new ParagraphBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};