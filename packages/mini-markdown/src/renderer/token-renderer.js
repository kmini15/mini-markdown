export class TokenRenderer {
  constructor() {
    this.maxTextLength = 30;
  }

  render(node, prefix = "") {
    let result = `[<span class="color-node-type">${node.type}</span>]`;
    for (const token of node.data.tokens) {
      result += "\n";
      if (node.firstChild) {
        result += prefix + "│  + ";
      } else {
        result += prefix + "   + ";
      }
      result += `[<span class="color-token-type">${token.type}</span>]`;


      let text = token.text.replace(/\r\n|\n/g, "\\n");
      if (text && text.length > this.maxTextLength) {
        text = text.slice(0, this.maxTextLength - 3) + "...";
      }
      const escaped_text = this.escapeHtml(text);
      const nowrap_text = escaped_text.replace(/\r\n|\n/g, "\\n");
      const render_text = nowrap_text;
      result += `["<span class="color-token-text">${render_text}</span>"]`;
      result += `[<span class="color-cursor-row">${token.start.row}</span>`
      result += `:<span class="color-cursor-col">${token.start.col}</span>`
      result += `(<span class="color-cursor-idx">${token.start.idx}</span>)`
      result += `-<span class="color-cursor-row">${token.end.row}</span>`
      result += `:<span class="color-cursor-col">${token.end.col}</span>`
      result += `(<span class="color-cursor-idx">${token.end.idx}</span>)]`;
    }
    result += "\n";
    for (let child = node.firstChild; child; child = child.next) {
      if (child === node.lastChild) {
        result += prefix + "└──" + this.render(child, prefix + "   ");
      } else {
        result += prefix + "├──" + this.render(child, prefix + "│  ");
      }
    }
    return result;
  }

  escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
