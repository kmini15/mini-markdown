import { ParagraphRule } from "./rule.js";
import { ParagraphRenderer } from "./renderer.js";
import { ParagraphBehavior } from "./behavior.js";

const name = "paragraph";

export default {
  name: name,
  blockRules: [new ParagraphRule(name)],
  renderers: {
    [name]: new ParagraphRenderer(name),
  },
  styles: [
    new URL("./style.css", import.meta.url).href,
  ],
  behaviors: [
    new ParagraphBehavior(name),
  ],
};