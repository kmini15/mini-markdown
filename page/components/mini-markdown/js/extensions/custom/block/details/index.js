import { DetailsRule } from "./rule.js";
import { DetailsRenderer, DetailsSummaryRenderer } from "./renderer.js";
import { DetailsBehavior } from "./behavior.js";

const name = "details";

export default {
  name: name,
  blockRules: [{
    rule: new DetailsRule(name),
    priority: {
      major: 4500,
      minor: 5000,
    },
  }],
  inlineRules: [],
  renderers: [
    new DetailsRenderer(name),
    new DetailsSummaryRenderer(name + "-summary")
  ],
  behaviors: [new DetailsBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};