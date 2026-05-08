import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import TextWidth from "../../../../core/text-width.js";

class CodeBlockRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^((()\s{4}))(.*)$/;
    this.textWidth = new TextWidth();
  }

  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (match) {
      const [m_all, m_marker, m_column, m_indent, m_content] = match;
      const indent = this.textWidth.measure(m_indent) + context.input.column();
      if (indent < node.fields.indent) return false;
      context.input.consume(node.fields.column - context.input.column());
      const content = context.input.current();
      node.firstChild.value += "\n" + content;
      context.input.consume(content.length);
    } else {
      const match = line.match(/^(((\s*)))(.*)/);
      if (!match) return false;
      const [m_all, m_marker, m_column, m_indent, m_content] = match;
      const column = this.textWidth.measure(m_column) + context.input.column();
      if (column < node.fields.column) return false;
      context.input.consume(node.fields.column - context.input.column());
      const content = context.input.current();
      node.firstChild.value += "\n" + content;
      context.input.consume(content.length);
    }
    return true;
  }

  start(context, parent) {
    if (parent.type === this.type) return false;
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return false;
    return true;
  }

  parse(context, parent) {
    if (parent.type === this.type) return null;
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return null;
    const [m_all, m_marker, m_column, m_indent, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const text = new Node("text");
    text.value = m_content;
    text.fields = {
      inline: false,
    };
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
    };
    child.appendChild(text);
    context.input.consume(m_all.length);
    return child;
  }
}

export { CodeBlockRule };