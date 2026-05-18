import { DetailsRule } from "./block.js";
import { DetailsRenderer, DetailsSummaryRenderer } from "./renderer.js";

const name = "details";

export const Details = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new DetailsRule(name),
  }],
  renderers: [
    new DetailsRenderer(name),
    new DetailsSummaryRenderer(name + "-summary")
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};