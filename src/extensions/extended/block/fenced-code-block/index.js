import { FencedCodeBlockRule } from "./rule.js";
import { FencedCodeBlockRenderer } from "./renderer.js";

const name = "fenced-code-block";

export default {
  name: name,
  blockRules: [{
    rule: new FencedCodeBlockRule(name),
    priority: { major: 4500, minor: 6000 },
  }],
  inlineRules: [],
  renderers: [new FencedCodeBlockRenderer(name)],
  behaviors: [],
  styles: [new URL("./style.css", import.meta.url).href],
};