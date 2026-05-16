import FencedCodeBlock from "./block/fenced-code-block/index.js";
import HeadingAtxId from "./block/heading-atx-id/index.js";
import Table from "./block/table/index.js";

const name = "extended";

export default {
  name: name,
  blockRules: [
    ...FencedCodeBlock.blockRules,
    // ...HeadingAtxId.blockRules,
    // ...Table.blockRules,
  ],
  inlineRules: [
    ...FencedCodeBlock.inlineRules,
    // ...HeadingAtxId.inlineRules,
    // ...Table.inlineRules,
  ],
  renderers: [
    ...FencedCodeBlock.renderers,
    // ...HeadingAtxId.renderers,
    // ...Table.renderers,
  ],
  behaviors: [
    ...FencedCodeBlock.behaviors,
    // ...HeadingAtxId.behaviors,
    // ...Table.behaviors,
  ],
  styles: [
    ...FencedCodeBlock.styles,
    // ...HeadingAtxId.styles,
    // ...Table.styles,
  ],
};