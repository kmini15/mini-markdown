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
      result += `[<span class="color-cursor-row">${token.start.row}</span>`
      result += `:<span class="color-cursor-col">${token.start.col}</span>`
      result += `(<span class="color-cursor-idx">${token.start.idx}</span>)`
      result += `-<span class="color-cursor-row">${token.end.row}</span>`
      result += `:<span class="color-cursor-col">${token.end.col}</span>`
      result += `(<span class="color-cursor-idx">${token.end.idx}</span>)]`;
      result += `[<span class="color-token-type">${token.type}</span>]`;
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
