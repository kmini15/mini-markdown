import { AutolinkUrlRule } from "./rule.js";
import { AutolinkUrlRenderer } from "./renderer.js";
import { AutolinkUrlBehavior } from "./behavior.js";

const name = "autolink-url";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new AutolinkUrlRule(name),
    priority: {
      major: 8000,
      minor: 5000,
    },
  }],
  renderers: [new AutolinkUrlRenderer(name)],
  behaviors: [new AutolinkUrlBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};