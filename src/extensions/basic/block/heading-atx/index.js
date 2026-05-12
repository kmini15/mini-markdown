import { HeadingAtxRule } from "./rule.js";
import { HeadingAtxRenderer } from "./renderer.js";
import { HeadingAtxBehavior } from "./behavior.js";

const name = "heading-atx";

export default {
  name: name,
  blockRules: [{
    rule: new HeadingAtxRule(name),
    priority: {
      major: 6000,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [new HeadingAtxRenderer(name)],
  behaviors: [new HeadingAtxBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};