import Renderer from "../../../renderer.js";

class JustifiedRowRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.width) {
      style += `--width: ${node.fields.width};`;
    }
    if (node.fields.gap) {
      style += `--gap: ${node.fields.gap};`;
    }
    if (node.fields.style) {
      style += node.fields.style.slice(1, -1);
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}

class JustifiedRowItemRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.fields.style) {
      style += node.fields.style.slice(1, -1);
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}

export { JustifiedRowRenderer, JustifiedRowItemRenderer };