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
import Code from "./inline/code/index.js";
import Emphasis from "./inline/emphasis/index.js";
import Escape from "./inline/escape/index.js";
import HardBreak from "./inline/hard-break/index.js";
import Image from "./inline/image/index.js";
import Link from "./inline/link/index.js";
import LinkCitation from "./inline/link-citation/index.js";
import SoftBreak from "./inline/soft-break/index.js";

const name = "basic";

export default {
  name: name,
  blockRules: [
    ...Document.blockRules,
    ...CodeBlock.blockRules,
    ...Blockquote.blockRules,
    ...List.blockRules,
    ...Html.blockRules,
    ...HeadingAtx.blockRules,
    ...HeadingSetext.blockRules,
    ...HorizontalRule.blockRules,
    ...LinkReference.blockRules,
    ...Paragraph.blockRules,
  ],
  inlineRules: [
    ...HardBreak.inlineRules,
    ...SoftBreak.inlineRules,
    ...Escape.inlineRules,
    ...Code.inlineRules,
    ...Image.inlineRules,
    ...Link.inlineRules,
    ...LinkCitation.inlineRules,
    ...AutolinkUrl.inlineRules,
    ...AutolinkEmail.inlineRules,
    ...Emphasis.inlineRules,
  ],
  renderers: [
    ...Document.renderers,
    ...CodeBlock.renderers,
    ...Blockquote.renderers,
    ...List.renderers,
    ...Html.renderers,
    ...HeadingAtx.renderers,
    ...HeadingSetext.renderers,
    ...HorizontalRule.renderers,
    ...LinkReference.renderers,
    ...Paragraph.renderers,
    ...HardBreak.renderers,
    ...SoftBreak.renderers,
    ...Escape.renderers,
    ...Code.renderers,
    ...Image.renderers,
    ...Link.renderers,
    ...LinkCitation.renderers,
    ...AutolinkUrl.renderers,
    ...AutolinkEmail.renderers,
    ...Emphasis.renderers,
  ],
  styles: [
    ...Document.styles,
    ...CodeBlock.styles,
    ...Blockquote.styles,
    ...List.styles,
    ...Html.styles,
    ...HeadingAtx.styles,
    ...HeadingSetext.styles,
    ...HorizontalRule.styles,
    ...LinkReference.styles,
    ...Paragraph.styles,
    ...HardBreak.styles,
    ...SoftBreak.styles,
    ...Escape.styles,
    ...Code.styles,
    ...Image.styles,
    ...Link.styles,
    ...LinkCitation.styles,
    ...AutolinkUrl.styles,
    ...AutolinkEmail.styles,
    ...Emphasis.styles,
  ],
  behaviors: [
    ...Document.behaviors,
    ...CodeBlock.behaviors,
    ...Blockquote.behaviors,
    ...List.behaviors,
    ...Html.behaviors,
    ...HeadingAtx.behaviors,
    ...HeadingSetext.behaviors,
    ...HorizontalRule.behaviors,
    ...LinkReference.behaviors,
    ...Paragraph.behaviors,
    ...HardBreak.behaviors,
    ...SoftBreak.behaviors,
    ...Escape.behaviors,
    ...Code.behaviors,
    ...Image.behaviors,
    ...Link.behaviors,
    ...LinkCitation.behaviors,
    ...AutolinkUrl.behaviors,
    ...AutolinkEmail.behaviors,
    ...Emphasis.behaviors,
  ],
};