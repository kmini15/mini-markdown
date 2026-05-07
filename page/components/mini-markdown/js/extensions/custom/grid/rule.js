import Rule from "../../rule.js";
import Node from "../../../core/node.js";
import TextWidth from "../../../core/text-width.js";

class GridRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern_open = /^(((\s*)::::)\[([^\]:]+):([^\]:]+):([^\]:]+)\]({[^}]*})?)\s*$/;
    this.pattern_item = /^(((\s*)(\[[:.' ]{2}\]))({[^}]*})?)(.*)$/;
    this.textWidth = new TextWidth();
  }

  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern_item);
    if (match) {
      const [m_all, m_marker, m_column, m_indent, m_align, m_style] = match;
      const indent = this.textWidth.measure(m_indent) + context.input.column();
      if (indent < node.fields.indent) return false;
      context.input.consume(node.fields.indent - context.input.column());
      return true;
    } else {
      const match = line.match(/^(((\s*)))/);
      const [m_all, m_marker, m_column, m_indent] = match;
      const column = this.textWidth.measure(m_column) + context.input.column();
      if (column < node.fields.column) return false;
      context.input.consume(node.fields.indent - context.input.column());
      return true;
    }
  }

  start(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern_open);
    if (!match) return false;
    return true;
  }

  parse(context, parent) {
    const line = context.input.current();
    const match = line.match(this.pattern_open);
    if (!match) return null;
    const [m_all, m_marker, m_column, m_indent, m_width, m_gap, m_columns, m_style] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
      width: m_width.trim(),
      gap: m_gap.trim(),
      columns: m_columns.trim(),
      style: m_style ? m_style.slice(1, -1) : "",
    };
    context.input.consume(line.length);
    return child;
  }
}

class GridItemRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern_item = /^(((\s*)(\[[:.' ]{2}\]))({[^}]*})?)(.*)$/;
    this.textWidth = new TextWidth();
  }

  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern_item);
    if (match) {
      const [m_all, m_marker, m_column, m_indent, m_align, m_style] = match;
      const indent = this.textWidth.measure(m_indent) + context.input.column();
      if (indent < node.fields.column) return false;
      context.input.consume(node.fields.column - context.input.column());
      return true;
    } else {
      const match = line.match(/^(((\s*)))/);
      const [m_all, m_marker, m_column, m_indent] = match;
      const column = this.textWidth.measure(m_column) + context.input.column();
      if (column < node.fields.column) return false;
      context.input.consume(node.fields.column - context.input.column());
      return true;
    }
  }

  start(context, parent) {
    if (parent.type !== "grid") return false;
    if (parent.type === this.type) return false;
    const line = context.input.current();
    const match = line.match(this.pattern_item);
    if (!match) return false;
    return true;
  }

  parse(context, parent) {
    if (parent.type !== "grid") return null;
    if (parent.type === this.type) return null;
    const line = context.input.current();
    const match = line.match(this.pattern_item);
    if (!match) return null;
    const [m_all, m_marker, m_column, m_indent, m_align, m_style, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
      align: m_align,
      style: m_style ? m_style.slice(1, -1) : "",
    };
    context.input.consume(m_marker.length);
    return child;
  }
}

export { GridRule, GridItemRule };