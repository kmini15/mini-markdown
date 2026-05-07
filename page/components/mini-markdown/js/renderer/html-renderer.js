import Node from "../core/node.js";
import { DocumentRenderer } from "../extensions/basic/document/renderer.js";
import { ParagraphRenderer } from "../extensions/basic/paragraph/renderer.js";
import { HeadingRenderer } from "../extensions/basic/heading/renderer.js";

class HtmlRenderer {
  constructor(renderers = {}) {
    this.renderers = renderers;
  }

  render(node) {
    let text = "";
    for (let child = node.firstChild; child; child = child.next) {
      text += this.render(child);
    }
    // console.log("render", node.type, text);
    const renderer = this.renderers[node.type];
    if (renderer) {
      return renderer.render(text, node);
    } else {
      if (node.type === "soft_break") {
        return "\n";
      }
      if (node.type === "image") {
        return `<img src="${node.fields.src}" alt="${node.fields.alt}">`;
      }
      return node.value || text;
    }
  }
}


export default HtmlRenderer;