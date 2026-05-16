import Renderer from "../../../../core/renderer.js";

export class HeadingAtxRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.data.fields.level;
    return `<h${level} class="heading-atx">${text}</h${level}>\n`;
  }
}
