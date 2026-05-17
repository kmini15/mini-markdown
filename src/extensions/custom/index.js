import { Details } from "./block/details/index.js";
import { Grid } from "./block/grid/index.js";
import { GridTable } from "./block/grid-table/index.js"
import { JustifiedRow } from "./block/justified-row/index.js";
import { ImageStyle } from "./inline/image-style/index.js";

const name = "custom";

const blocks = [
  Details,
  Grid,
  GridTable,
  JustifiedRow,
];

const inlines = [
  ImageStyle,
];

const extensions = [
  ...blocks,
  ...inlines,
];

const collect = key => extensions.flatMap(extension => extension[key] ?? []);

export const Custom = {
  name: name,
  blocks: collect("blocks"),
  inlines: collect("inlines"),
  renderers: collect("renderers"),
  behaviors: collect("behaviors"),
  styles: collect("styles"),
};
