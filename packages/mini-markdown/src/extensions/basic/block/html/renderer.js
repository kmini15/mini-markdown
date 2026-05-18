import { Renderer } from "../../../../core/renderer.js";

export class HtmlRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let content = "";
    for (let child = node.firstChild; child; child = child.next) {
      content += child.content.text;
    }
    return content;
  }
}
  