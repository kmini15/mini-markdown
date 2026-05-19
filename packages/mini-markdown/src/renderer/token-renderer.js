export class TokenRenderer {
  constructor() {
    this.maxTextLength = 30;
  }

  render(root, text) {
    let result = "";
    const stack = [{
      node: root,
      prefix: "",
      branch: "",
    }];

    while (stack.length > 0) {
      const { node, prefix, branch } = stack.pop();

      result += branch;
      result += `[<span class="color-node-type">${this.escapeHtml(node.type)}</span>]`;

      for (const token of node.data.tokens ?? []) {
        result += "\n";

        if (node.firstChild) {
          result += prefix + "│  + ";
        } else {
          result += prefix + "   + ";
        }

        result += `[<span class="color-cursor-offset">${token.start.offset}</span>`;
        result += `-<span class="color-cursor-offset">${token.end.offset}</span>]`;

        result += `[<span class="color-cursor-row">${token.start.row}</span>`;
        result += `:<span class="color-cursor-col">${token.start.col}</span>`;
        result += `(<span class="color-cursor-idx">${token.start.idx}</span>)`;
        result += `-<span class="color-cursor-row">${token.end.row}</span>`;
        result += `:<span class="color-cursor-col">${token.end.col}</span>`;
        result += `(<span class="color-cursor-idx">${token.end.idx}</span>)]`;

        result += `[<span class="color-token-type">${token.type}</span>]`;
        
        const segmentText = text.slice(token.start.offset, token.end.offset).replace(/\r\n|\n/g, "\\n");
        let displayText = segmentText;
        if (displayText.length > this.maxTextLength) {
          displayText = displayText.slice(0, this.maxTextLength - 3) + "...";
        }
        result += `("<span class="color-node-text">${this.escapeHtml(displayText)}</span>")`;
      }

      result += "\n";

      const children = [];
      for (let child = node.firstChild; child; child = child.next) {
        children.push(child);
      }

      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        const isLast = child === node.lastChild;

        stack.push({
          node: child,
          prefix: prefix + (isLast ? "   " : "│  "),
          branch: prefix + (isLast ? "└──" : "├──"),
        });
      }
    }

    return result;
  }

  escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}