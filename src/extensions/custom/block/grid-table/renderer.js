import Renderer from "../../../../core/renderer.js";

export class GridTableRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.columns) {
      style += `--columns: ${node.data.fields.columns};`;
    }
    if (style) {
      style = ` style="${style}"`;
    }
    return `<div class="${this.type}"${style}>\n${text}</div>\n`;
  }
}

export class GridTableRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `${text}`;
  }
}

export class GridTableCellRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.rowSpan) {
      style += `--row-span: ${node.data.fields.rowSpan};`;
    }
    if (node.data.fields.colSpan) {
      style += `--col-span: ${node.data.fields.colSpan};`;
    }
    if (node.data.fields.alignH) {
      switch (node.data.fields.alignH) {
        case "left":
          style += `--align-h: start;`;
          break;
        case "center":
          style += `--align-h: center;`;
          break;
        case "right":
          style += `--align-h: end;`;
          break;
      }
    }
    if (node.data.fields.alignV) {
      switch (node.data.fields.alignV) {
        case "top":
          style += `--align-v: start;`;
          break;
        case "middle":
          style += `--align-v: center;`;
          break;
        case "bottom":
          style += `--align-v: end;`;
          break;
      }
    }
    if (style) {
      style = ` style="${style}"`;
    }
    let type = "";
    if (node.data.fields.header) {
      type = "grid-table-head";
    } else {
      type = "grid-table-data";
    }
    return `<div class="${this.type} ${type}"${style}>${text}</div>\n`;
  }
}
