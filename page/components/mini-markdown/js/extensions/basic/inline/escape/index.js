import { EscapeRule } from "./rule.js";
import { EscapeRenderer } from "./renderer.js";
import { EscapeBehavior } from "./behavior.js";

const name = "escape";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new EscapeRule(name),
    priority: {
      major: 3000,
      minor: 5000,
    },
  }],
  renderers: [new EscapeRenderer(name)],
  behaviors: [new EscapeBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};