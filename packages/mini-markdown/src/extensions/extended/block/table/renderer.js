import { Renderer } from "../../../../core/renderer.js";

export class TableRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<div class="${this.type}"><table class="${this.type}">\n${text}</table></div>\n`;
  }
}

export class TableRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<tr class="${this.type}">\n${text}</tr>\n`;
  }
}

export class TableCellRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.align) {
      style += `--align-h: ${node.data.fields.align};`;
    }
    if (style) {
      style = ` style="${style}"`;
    }
    if (node.data.fields.isHeader) {
      return `<th class="${this.type}"${style}>${text}</th>\n`;
    } else {
      return `<td class="${this.type}"${style}>${text}</td>\n`;
    }
  }
}
