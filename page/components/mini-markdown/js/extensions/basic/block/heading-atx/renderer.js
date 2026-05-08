import Renderer from "../../../renderer.js";

class HeadingAtxRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.fields.level;
    return `<h${level} class="heading-atx">${text}</h${level}>\n`;
  }
}

export { HeadingAtxRenderer };
