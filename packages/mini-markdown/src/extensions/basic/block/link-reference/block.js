import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

export class LinkReferenceRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(\[)([^\]]+)(\])(:\s+)(\S+?)(\s+)((")([^"]+)("))?(\s*)$/;
  }

  parse(context, parent) {
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const [
      m_all, m_indent,
      m_open, m_label, m_close,
      m_sep, m_href, m_trailing1,
      m_title_all, m_quote1, m_title, m_quote2, m_trailing2,
    ] = match;
    const cursor0 = context.input.capture();
    context.input.consume(m_indent.length);
    const cursor1 = context.input.capture();
    context.input.consume(m_open.length);
    const cursor2 = context.input.capture();
    context.input.consume(m_label.length);
    const cursor3 = context.input.capture();
    context.input.consume(m_close.length);
    const cursor4 = context.input.capture();
    context.input.consume(m_sep.length);
    const cursor5 = context.input.capture();
    context.input.consume(m_href.length);
    const cursor6 = context.input.capture();
    context.input.consume(m_trailing1.length);
    const cursor7 = context.input.capture();
    context.input.consume(m_quote1 ? m_quote1.length : 0);
    const cursor8 = context.input.capture();
    context.input.consume(m_title ? m_title.length : 0);
    const cursor9 = context.input.capture();
    context.input.consume(m_quote2 ? m_quote2.length : 0);
    const cursor10 = context.input.capture();
    context.input.consume(m_trailing2.length);
    const cursor11 = context.input.capture();
    const child = new Node(this.type);
    child.content = {
      text: "",
      start: cursor1,
      end: cursor1,
    };
    child.data.fields = {
      label: m_label,
      href: m_href,
      title: m_title,
    };
    child.data.tokens.push(
      {
        type: "marker",
        text: m_open,
        start: cursor1,
        end: cursor2,
      },
      {
        type: "keyword",
        text: m_label,
        start: cursor2,
        end: cursor3,
      },
      {
        type: "marker",
        text: m_close,
        start: cursor3,
        end: cursor4,
      },
      {
        type: "marker",
        text: m_sep,
        start: cursor4,
        end: cursor5,
      },
      {
        type: "keyword",
        text: m_href,
        start: cursor5,
        end: cursor6,
      },
    );
    if (m_title_all) {
      child.data.tokens.push(
        {
          type: "marker",
          text: m_quote1,
          start: cursor7,
          end: cursor8,
        },
        {
          type: "keyword",
          text: m_title,
          start: cursor8,
          end: cursor9,
        },
        {
          type: "marker",
          text: m_quote2,
          start: cursor9,
          end: cursor10,
        }
      );
    }
    return child;
  }
}
