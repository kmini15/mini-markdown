import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import TextWidth from "../../../../core/text-width.js";

class DetailsRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(((\s*)(<\.\.>|<\'\'>))\[([^\]]+)\]\s*)$/;
    this.textWidth = new TextWidth();
  }
  
  continue(context, node) {
    const line = context.input.current();
    const match = /(\s*)/.exec(line);
    if (!match) return false;
    const [m_all, m_column] = match;
    const column = this.textWidth.measure(m_column) + context.input.column();
    if (column < node.fields.column) return false;
    context.input.consume(node.fields.column - context.input.column());
    return true;
  }
  
  start(context, parent) {
    const capture = context.input.capture();
    const child = this.parse(context, parent);
    context.input.restore(capture);
    if (!child) return false;
    return true;
  }
  
  parse(context, parent) {
    const line = context.input.current();
    const match = this.pattern.exec(line);
    if (!match) return null;
    const [m_all, m_marker, m_column, m_indent, m_type, m_summary] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const summaryText = new Node("text");
    summaryText.value = m_summary.trim();
    summaryText.fields = {
      inline: true,
    }
    const summaryNode = new Node("details-summary");
    summaryNode.appendChild(summaryText);
    const node = new Node(this.type);
    node.fields = {
      indent: indent,
      column: column,
      open: m_type === "<\'\'>",
    }
    node.appendChild(summaryNode);
    const detailsText = new Node("text");
    detailsText.value = "";
    detailsText.fields = {
      inline: true,
    }
    node.appendChild(detailsText);
    context.input.consume(m_all.length);
    return node;
  }
}

export { DetailsRule };