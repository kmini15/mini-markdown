import Grid from "./block/grid/index.js";
import GridTable from "./block/grid-table/index.js"
import JustifiedRow from "./block/justified-row/index.js";
import ImageStyle from "./inline/image-style/index.js";

const name = "custom";

export default {
  name: name,
  blockRules: [
    ...Grid.blockRules,
    ...GridTable.blockRules,
    ...JustifiedRow.blockRules,
    ...ImageStyle.blockRules,
  ],
  inlineRules: [
    ...Grid.inlineRules,
    ...GridTable.inlineRules,
    ...JustifiedRow.inlineRules,
    ...ImageStyle.inlineRules,
  ],
  renderers: [
    ...Grid.renderers,
    ...GridTable.renderers,
    ...JustifiedRow.renderers,
    ...ImageStyle.renderers,
  ],
  behaviors: [
    ...Grid.behaviors,
    ...GridTable.behaviors,
    ...JustifiedRow.behaviors,
    ...ImageStyle.behaviors,
  ],
  styles: [
    ...Grid.styles,
    ...GridTable.styles,
    ...JustifiedRow.styles,
    ...ImageStyle.styles,
  ],
};