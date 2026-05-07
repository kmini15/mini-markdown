import Rule from "../../rule.js";
import Node from "../../../core/node.js";
import TextWidth from "../../../core/text-width.js";

class ListRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(((\s*)([-+*]|\d+[.)])\s))(.*)/;
    this.textWidth = new TextWidth();
  }

  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (match) {
      const [m_all, m_marker, m_column, m_indent, m_type, m_content] = match;
      const indent = this.textWidth.measure(m_indent) + context.input.column();
      if (indent < node.fields.indent) return false;
      context.input.consume(node.fields.indent - context.input.column());
      return true;
    } else {
      const match = line.match(/^(((\s*)))(.*)/);
      if (!match) return false; 
      const [m_all, m_marker, m_column, m_indent, m_content] = match;
      const column = this.textWidth.measure(m_column) + context.input.column();
      if (column < node.fields.column) return false;
      context.input.consume(node.fields.indent - context.input.column());
      return true;
    }
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
    const [m_all, m_marker, m_column, m_indent, m_type, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
      ordered: /^\d+[.)]$/.test(m_type),
    }
    return child;
  }
}

class ListItemRule extends Rule {
  constructor(type) {
    super(type);
    this.pattern = /^(((\s*)([-+*]|\d+[.)])\s))(.*)/;
    this.textWidth = new TextWidth();
  }

  continue(context, node) {
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (match) {
      const [m_all, m_marker, m_column, m_indent, m_type, m_content] = match;
      const indent = this.textWidth.measure(m_indent) + context.input.column();
      if (indent < node.fields.column) return false;
      context.input.consume(node.fields.column - context.input.column());
      return true;
    } else {
      const match = line.match(/^(((\s*)))(.*)/);
      if (!match) return false; 
      const [m_all, m_marker, m_column, m_indent, m_content] = match;
      const column = this.textWidth.measure(m_column) + context.input.column();
      if (column < node.fields.column) return false;
      context.input.consume(node.fields.column - context.input.column());
      return true;
    }
  }

  start(context, parent) {
    if (parent.type !== "list") return false;
    if (parent.type === this.type) return false;
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return false;
    return true;
  }
  
  parse(context, parent) {
    if (parent.type !== "list") return null;
    if (parent.type === this.type) return null;
    const line = context.input.current();
    const match = line.match(this.pattern);
    if (!match) return null;
    const [m_all, m_marker, m_column, m_indent, m_type, m_content] = match;
    const indent = this.textWidth.measure(m_indent) + context.input.column();
    const column = this.textWidth.measure(m_column) + context.input.column();
    const child = new Node(this.type);
    child.fields = {
      indent: indent,
      column: column,
    }
    context.input.consume(m_marker.length);
    return child;
  }
}

export { ListRule, ListItemRule };