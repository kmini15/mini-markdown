import Node from "../core/node.js";

class HtmlRenderer {
  constructor(renderers) {
    this.renderers = renderers;
  }
  
  getRenderer(node) {
    return this.renderers.find(renderer => renderer.type === node.type);
  }

  render(node) {
    let text = "";
    for (let child = node.firstChild; child; child = child.next) {
      text += this.render(child);
    }
    const renderer = this.getRenderer(node);
    if (renderer) {
      return renderer.render(text, node);
    } else {
      return node.value || text;
    }
  }
}


export default HtmlRenderer;