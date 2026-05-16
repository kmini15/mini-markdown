import Renderer from "../../../../core/renderer.js";

class DetailsRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    if (node.fields.open) {
      return `<details class="${this.type}" open>\n${text}</details>\n`;
    } else {
      return `<details class="${this.type}">${text}</details>`;
    }
  }
}

class DetailsSummaryRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    return `<summary>${text}</summary>\n`;
  }
}

export { DetailsRenderer };
export { DetailsSummaryRenderer };