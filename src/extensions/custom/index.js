import Details from "./block/details/index.js";
import Grid from "./block/grid/index.js";
import GridTable from "./block/grid-table/index.js"
import JustifiedRow from "./block/justified-row/index.js";
import ImageStyle from "./inline/image-style/index.js";

const name = "custom";

const extensions = [
  /* Blocks */
  // Details,
  Grid,
  // GridTable,
  // JustifiedRow,
  /* Inlines */
  // ImageStyle,
];

const blocks = extensions.flatMap(ext => ext.blocks ?? []);
const inlines = extensions.flatMap(ext => ext.inlines ?? []);
const renderers = extensions.flatMap(ext => ext.renderers ?? []);
const behaviors = extensions.flatMap(ext => ext.behaviors ?? []);
const styles = extensions.flatMap(ext => ext.styles ?? []);

export default {
  name: name,
  blocks: blocks,
  inlines: inlines,
  renderers: renderers,
  behaviors: behaviors,
  styles: styles,
};
