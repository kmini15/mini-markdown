import { HtmlRule } from "./rule.js";
import { HtmlRenderer } from "./renderer.js";
import { HtmlBehavior } from "./behavior.js";

const name = "html";

export default {
  name: name,
  blockRules: [new HtmlRule(name)],
  renderers: {
    [name]: new HtmlRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new HtmlBehavior(name),
  ],
};