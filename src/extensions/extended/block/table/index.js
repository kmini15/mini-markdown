import { TableRule } from "./block.js";
import { TableRenderer, TableRowRenderer, TableCellRenderer } from "./renderer.js";

const name = "table";

export default {
  name: name,
  blocks: [{
    rule: new TableRule(name),
    priority: { major: 4500, minor: 6000 },
  }],
  renderers: [
    new TableRenderer(name),
    new TableRowRenderer(name + "-row"),
    new TableCellRenderer(name + "-cell"),
  ],
  styles: [new URL("./style.css", import.meta.url).href],
};