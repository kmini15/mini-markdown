import { TableRule } from "./block.js";
import { TableRenderer, TableRowRenderer, TableCellRenderer } from "./renderer.js";

const name = "table";

export const Table = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new TableRule(name),
  }],
  renderers: [
    new TableRenderer(name),
    new TableRowRenderer(name + "-row"),
    new TableCellRenderer(name + "-cell"),
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};