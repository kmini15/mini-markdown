import { Renderer } from "../../../../core/renderer.js";
  
export class HeadingAtxIdRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    const level = node.data.fields.level;
    let id = "";
    if (node.data.fields.id) {
      id = node.data.fields.id;
    }
    if (id) {
      id = ` id="${id}"`;
    }
    return `<h${level}${id} class="heading-atx-id">${text}</h${level}>\n`;
  }
}
