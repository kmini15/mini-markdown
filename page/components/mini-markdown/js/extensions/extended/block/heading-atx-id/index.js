import { HeadingAtxIdRule } from "./rule.js";
import { HeadingAtxIdRenderer } from "./renderer.js";
import { HeadingAtxIdBehavior } from "./behavior.js";

const name = "heading-atx-id";

export default {
  name: name,
  blockRules: [{
    rule: new HeadingAtxIdRule(name),
    priority: {
      major: 6000,
      minor: 4000,
    },
  }],
  inlineRules: [],
  renderers: [new HeadingAtxIdRenderer(name)],
  behaviors: [new HeadingAtxIdBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};