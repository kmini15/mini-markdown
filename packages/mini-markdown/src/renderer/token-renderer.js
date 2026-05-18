export class TokenRenderer {
  constructor() {
    this.maxTextLength = 30;
  }

  render(node, prefix = "") {
    let result = `[<span class="type">${node.type}</span>]`;
    for (const token of node.data.tokens) {
      result += "\n";
      if (node.firstChild) {
        result += prefix + "│  + ";
      } else {
        result += prefix + "   + ";
      }
      result += `[<span class="marker">${token.type}</span>]`;
      result += `["<span class="marker">${token.text}</span>"]`;
      result += `[<span class="token-start-row">${token.start.row}</span>`
      result += `:<span class="token-start-col">${token.start.col}</span>`
      result += `(<span class="token-start-idx">${token.start.idx}</span>)`
      result += `-<span class="token-end-row">${token.end.row}</span>`
      result += `:<span class="token-end-col">${token.end.col}</span>`
      result += `(<span class="token-end-idx">${token.end.idx}</span>)]`;
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
