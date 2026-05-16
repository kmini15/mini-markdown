import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

class LinkReferenceRule extends Block {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)(\[([^\]]+)\]:\s+(\S+?)(\s+"([^"]+)")?)(\s*)$/;
  }
  
  parse(context, parent) {
    if (parent.data.type !== "document") return null;
    const input = context.input.current();
    const match = this.pattern.exec(input);
    if (!match) return null;
    const [m_all, m_indent, m_token, m_label, m_href, m_title_group, m_title, m_trailing] = match;
    context.input.consume(m_indent.length);
    const cursor0 = context.input.capture();
    context.input.consume(m_token.length);
    const cursor1 = context.input.capture();
    context.input.consume(m_trailing.length);
    const cursor2 = context.input.capture();
    const child = new Node(this.type);
    child.data.token = {
      text: m_token,
      start: cursor0,
      end: cursor1,
    };
    child.data.fields = {
      label: m_label,
      href: m_href,
      title: m_title,
    };
    return child;
  }
}

export { LinkReferenceRule };