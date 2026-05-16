import Renderer from "../../../../core/renderer.js";

export class HeadingSetextRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.data.fields.level;
    return `<h${level} class="heading-setext">${text}</h${level}>\n`;
  }
}
