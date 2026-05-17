import { FencedCodeBlock } from "./block/fenced-code-block/index.js";
import { HeadingAtxId } from "./block/heading-atx-id/index.js";
import { Table } from "./block/table/index.js";

const name = "extended";

const blocks = [
  FencedCodeBlock,
  HeadingAtxId,
  Table,
];

const inlines = [];

const extensions = [
  ...blocks,
  ...inlines,
];

const collect = key => extensions.flatMap(extension => extension[key] ?? []);

export const Extended = {
  name: name,
  blocks: collect("blocks"),
  inlines: collect("inlines"),
  renderers: collect("renderers"),
  behaviors: collect("behaviors"),
  styles: collect("styles"),
};
