class HtmlRenderer {
  constructor(renderers) {
    this.renderers = renderers;
  }

  getRenderer(node) {
    return this.renderers.find(renderer => renderer.type === node.data.type);
  }

  render(node) {
    switch (node.data.type) {
      case "text":
        return this.escapeHtml(node.data.token.text);
      case "literal":
        return this.escapeHtml(node.data.token.text);
    }
    let text = "";
    for (let child = node.firstChild; child; child = child.next) {
      text += this.render(child);
    }
    const renderer = this.getRenderer(node);
    if (renderer) {
      return renderer.render(text, node);
    }
    return text;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}


export default HtmlRenderer;