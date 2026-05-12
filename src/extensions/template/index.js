import { TemplateRule } from "./rule.js";
import { TemplateRenderer } from "./renderer.js";
import { TemplateBehavior } from "./behavior.js";

const name = "template";

export default {
  name: name,
  blockRules: [new TemplateRule(name)],
  renderers: {
    [name]: new TemplateRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new TemplateBehavior(name),
  ],
};