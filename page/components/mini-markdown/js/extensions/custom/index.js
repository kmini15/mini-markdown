import Grid from "./block/grid/index.js";
import JustifiedRow from "./block/justified-row/index.js";
import ImageStyle from "./inline/image-style/index.js";

const name = "custom";

export default {
  name: name,
  blockRules: [
    ...Grid.blockRules,
    ...JustifiedRow.blockRules,
  ],
  inlineRules: [
    ...ImageStyle.inlineRules,
  ],
  renderers: [
    ...Grid.renderers,
    ...JustifiedRow.renderers,
    ...ImageStyle.renderers,
  ],
  behaviors: [
    ...Grid.behaviors,
    ...JustifiedRow.behaviors,
    ...ImageStyle.behaviors,
  ],
  styles: [
    ...Grid.styles,
    ...JustifiedRow.styles,
    ...ImageStyle.styles,
  ],
};