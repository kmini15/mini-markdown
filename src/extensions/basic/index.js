import Blockquote from "./block/blockquote/index.js";
import CodeBlock from "./block/code-block/index.js";
import Document from "./block/document/index.js"
import HeadingAtx from "./block/heading-atx/index.js";
import HeadingSetext from "./block/heading-setext/index.js";
import HorizontalRule from "./block/horizontal-rule/index.js";
import Html from "./block/html/index.js";
import LinkReference from "./block/link-reference/index.js";
import List from "./block/list/index.js";
import Paragraph from "./block/paragraph/index.js";
import AutolinkEmail from "./inline/autolink-email/index.js";
import AutolinkUrl from "./inline/autolink-url/index.js";
import CodeInline from "./inline/code-inline/index.js";
import Emphasis from "./inline/emphasis/index.js";
import Escape from "./inline/escape/index.js";
import HardBreak from "./inline/hard-break/index.js";
import Image from "./inline/image/index.js";
import Link from "./inline/link/index.js";
import LinkCitation from "./inline/link-citation/index.js";
import SoftBreak from "./inline/soft-break/index.js";

const name = "basic";

const extensions = [
  /* Blocks */
  Blockquote,
  CodeBlock,
  Document,
  HeadingAtx,
  HeadingSetext,
  HorizontalRule,
  Html,
  LinkReference,
  List,
  Paragraph,
  /* Inlines */
  AutolinkEmail,
  AutolinkUrl,
  CodeInline,
  Emphasis,
  Escape,
  HardBreak,
  Image,
  Link,
  LinkCitation,
  SoftBreak,
];

export default {
  name: name,
  blocks: extensions.flatMap(ext => ext.blocks ?? []),
  inlines: extensions.flatMap(ext => ext.inlines ?? []),
  renderers: extensions.flatMap(ext => ext.renderers ?? []),
  behaviors: extensions.flatMap(ext => ext.behaviors ?? []),
  styles: extensions.flatMap(ext => ext.styles ?? []),
};
