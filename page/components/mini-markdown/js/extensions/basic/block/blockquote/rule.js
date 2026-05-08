import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import TextWidth from "../../../../core/text-width.js";

class BlockquoteRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(((\s*)>))(.*)$/;
    this.textWidth = new TextWidth();
  }
  
  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return false;
    const [m_all, m_marker, m_column, m_indent, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    if (indent < node.fields.indent) return false;
    context.input.consume(m_marker.length);
    return true;
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
    const [m_all, m_marker, m_column, m_indent, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
    };
    context.input.consume(m_marker.length);
    return child;
  }
}

export { BlockquoteRule };