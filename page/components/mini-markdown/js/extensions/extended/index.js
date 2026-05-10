import Table from "./block/table/index.js";
import FencedCodeBlock from "./block/fenced-code-block/index.js";

const name = "extended";

export default {
  name: name,
  blockRules: [
    ...Table.blockRules,
    ...FencedCodeBlock.blockRules,
  ],
  inlineRules: [
    ...Table.inlineRules,
    ...FencedCodeBlock.inlineRules,
  ],
  renderers: [
    ...Table.renderers,
    ...FencedCodeBlock.renderers,
  ],
  behaviors: [
    ...Table.behaviors,
    ...FencedCodeBlock.behaviors,
  ],
  styles: [
    ...Table.styles,
    ...FencedCodeBlock.styles,
  ],
};