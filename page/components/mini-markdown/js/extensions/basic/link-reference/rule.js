import Rule from "../../rule.js";
import Node from "../../../core/node.js";

class LinkReferenceRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(\s*)\[([^\]]+)\]:\s+(\S+?)(\s+"([^"]+)")?\s*$/;
  }
  
  start(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return false;
    return true;
  }
  
  parse(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return null;
    const [m_all, m_indent, m_label, m_url, m_title_group, m_title] = match;
    const child = new Node(this.type);
    child.fields = {
      label: m_label,
      url: m_url,
      title: m_title,
    };
    context.input.consume(m_all.length);
    return child;
  }
}

export { LinkReferenceRule };