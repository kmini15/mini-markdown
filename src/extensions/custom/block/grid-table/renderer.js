import Renderer from "../../../../core/renderer.js";

class GridTableRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.columns) {
      style += `--columns: ${node.fields.columns};`;
    }
    if (style) {
      style = ` style="${style}"`;
    }
    return `<div class="${this.type}"${style}>\n${text}</div>\n`;
  }
}

class GridTableRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `${text}`;
  }
}

class GridTableCellRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.rowSpan) {
      style += `--row-span: ${node.fields.rowSpan};`;
    }
    if (node.fields.colSpan) {
      style += `--col-span: ${node.fields.colSpan};`;
    }
    if (node.fields.alignH) {
      switch (node.fields.alignH) {
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
    if (node.fields.alignV) {
      switch (node.fields.alignV) {
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
    if (node.fields.header) {
      type = "grid-table-head";
    } else {
      type = "grid-table-data";
    }
    return `<div class="${this.type} ${type}"${style}>${text}</div>\n`;
  }
}

export { GridTableRenderer, GridTableRowRenderer, GridTableCellRenderer };
