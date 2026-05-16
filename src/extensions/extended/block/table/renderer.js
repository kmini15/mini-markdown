import Renderer from "../../../../core/renderer.js";

class TableRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<div class="${this.type}"><table class="${this.type}">\n${text}</table></div>\n`;
  }
}

class TableRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<tr class="${this.type}">\n${text}</tr>\n`;
  }
}

class TableCellRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.align) {
      style += `--align-h: ${node.fields.align};`;
    }
    if (style) {
      style = ` style="${style}"`;
    }
    if (node.fields.isHeader) {
      return `<th class="${this.type}"${style}>${text}</th>\n`;
    } else {
      return `<td class="${this.type}"${style}>${text}</td>\n`;
    }
  }
}

export { TableRenderer, TableRowRenderer, TableCellRenderer };
