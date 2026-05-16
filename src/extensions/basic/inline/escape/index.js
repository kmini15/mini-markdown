import { EscapeRule } from "./inline.js";
import { EscapeRenderer } from "./renderer.js";

const name = "escape";

export default {
  name: name,
  inlines: [{
    rule: new EscapeRule(name),
    priority: { major: 3000, minor: 5000 },
  }],
  renderers: [new EscapeRenderer(name)],
};