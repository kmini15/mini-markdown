import FencedCodeBlock from "./block/fenced-code-block/index.js";
import HeadingAtxId from "./block/heading-atx-id/index.js";
import Table from "./block/table/index.js";

const name = "extended";

const extensions = [
  // FencedCodeBlock,
  HeadingAtxId,
  // Table,
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