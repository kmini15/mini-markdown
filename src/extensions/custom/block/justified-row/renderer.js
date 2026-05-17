import { Renderer } from "../../../../core/renderer.js";

export class JustifiedRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.width) {
      style += `--width: ${node.data.fields.width};`;
    }
    if (node.data.fields.gap) {
      style += `--gap: ${node.data.fields.gap};`;
    }
    if (node.data.fields.style) {
      style += node.data.fields.style.slice(1, -1);
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}

export class JustifiedRowItemRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.style) {
      style += node.data.fields.style.slice(1, -1);
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}
