import Renderer from "../../../renderer.js";

class HeadingSetextRenderer extends Renderer {
  constructor(type) {
    super(type);
  }
  
  render(text, node) {
    const level = node.fields.level;
    return `<h${level} class="heading-setext">${text}</h${level}>\n`;
  }
}

export { HeadingSetextRenderer };
    