import { TableRule } from "./rule.js";
import { TableRenderer, TableRowRenderer, TableCellRenderer } from "./renderer.js";
import { TableBehavior } from "./behavior.js";

const name = "table";

export default {
  name: name,
  blockRules: [{
    rule: new TableRule(name),
    priority: {
      major: 4500,
      minor: 6000,
    },
  }],
  inlineRules: [],
  renderers: [
    new TableRenderer(name),
    new TableRowRenderer(name + "-row"),
    new TableCellRenderer(name + "-cell"),
  ],
  behaviors: [new TableBehavior(name)],
  styles: [new URL("./style.css", import.meta.url).href],
};