import { HeadingSetextRule } from "./rule.js";
import { HeadingSetextRenderer } from "./renderer.js";
import { HeadingSetextBehavior } from "./behavior.js";

const name = "heading-setext";

export default {
  name: name,
  blockRules: [{
    rule: new HeadingSetextRule(name),
    priority: {
      major: 7000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new HeadingSetextRenderer(name)],
  behaviors: [new HeadingSetextBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};