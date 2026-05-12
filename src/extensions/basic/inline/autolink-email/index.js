import { AutolinkEmailRule } from "./rule.js";
import { AutolinkEmailRenderer } from "./renderer.js";
import { AutolinkEmailBehavior } from "./behavior.js";

const name = "autolink-email";

export default {
  name: name,
  blockRules: [],
  inlineRules: [{
    rule: new AutolinkEmailRule(name),
    priority: {
      major: 9000,
      minor: 5000,
    },
  }],
  renderers: [new AutolinkEmailRenderer(name)],
  behaviors: [new AutolinkEmailBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};