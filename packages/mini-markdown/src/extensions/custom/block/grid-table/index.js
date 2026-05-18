import { GridTableRule } from "./block.js";
import { GridTableRenderer, GridTableRowRenderer, GridTableCellRenderer } from "./renderer.js";

const name = "grid-table";

export const GridTable = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new GridTableRule(name),
  }],
  renderers: [
    new GridTableRenderer(name),
    new GridTableRowRenderer(name + "-row"),
    new GridTableCellRenderer(name + "-cell"),
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};