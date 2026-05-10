import Table from "./block/table/index.js";

const name = "extended";

export default {
  name: name,
  blockRules: [
    ...Table.blockRules,
  ],
  inlineRules: [
  ],
  renderers: [
    ...Table.renderers,
  ],
  behaviors: [
    ...Table.behaviors,
  ],
  styles: [
    ...Table.styles,
  ],
};