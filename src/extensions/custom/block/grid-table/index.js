import { GridTableRule } from "./block.js";
import { GridTableRenderer, GridTableRowRenderer, GridTableCellRenderer } from "./renderer.js";

const name = "grid-table";

export default {
  name: name,
  blocks: [{
    rule: new GridTableRule(name),
    priority: { major: 4500, minor: 6000, },
  }],
  renderers: [
    new GridTableRenderer(name),
    new GridTableRowRenderer(name + "-row"),
    new GridTableCellRenderer(name + "-cell"),
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};