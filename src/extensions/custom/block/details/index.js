import { DetailsRule } from "./block.js";
import { DetailsRenderer, DetailsSummaryRenderer } from "./renderer.js";

const name = "details";

export default {
  name: name,
  blocks: [{
    rule: new DetailsRule(name),
    priority: { major: 4500, minor: 5000 },
  }],
  renderers: [
    new DetailsRenderer(name),
    new DetailsSummaryRenderer(name + "-summary")
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};