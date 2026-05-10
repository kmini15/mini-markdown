import { GridTableRule } from "./rule.js";
import { GridTableRenderer, GridTableRowRenderer, GridTableCellRenderer } from "./renderer.js";
import { GridTableBehavior } from "./behavior.js";

const name = "grid-table";

export default {
  name: name,
  blockRules: [{
    rule: new GridTableRule(name),
    priority: {
      major: 4500,
      minor: 6000,
    },
  }],
  inlineRules: [],
  renderers: [
    new GridTableRenderer(name),
    new GridTableRowRenderer(name + "-row"),
    new GridTableCellRenderer(name + "-cell"),
  ],
  behaviors: [new GridTableBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};