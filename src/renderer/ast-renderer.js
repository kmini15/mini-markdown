import { Node } from "../core/node.js";

export class AstRenderer {
  constructor() {
    this.renderToken = true;
    this.renderFields = true;
    this.maxTextLength = 30;
  }

  render(node, prefix = "") {
    let result = `[<span class="type">${node.data.type}</span>]`;
    const token = node.data.token;
    const fields = node.data.fields;
    if (this.renderToken && token) {
      result += `[<span class="token-start-row">${token.start.row}</span>`
      result += `:<span class="token-start-col">${token.start.col}</span>`
      result += `(<span class="token-start-idx">${token.start.idx}</span>)`
      result += `-<span class="token-end-row">${token.end.row}</span>`
      result += `:<span class="token-end-col">${token.end.col}</span>`
      result += `(<span class="token-end-idx">${token.end.idx}</span>)]`;
    }
    if (this.renderToken && token) {
      let text = token.text.replace(/\r\n|\n/g, "\\n");
      if (text && text.length > this.maxTextLength) {
        text = text.slice(0, this.maxTextLength - 3) + "...";
      }
      const escaped_text = this.escapeHtml(text);
      const nowrap_text = escaped_text.replace(/\r\n|\n/g, "\\n");
      const render_text = nowrap_text;
      result += `("<span class="text">${render_text}</span>")`;
    }
    if (this.renderFields) {
      const string_fields = Object.entries(fields).map(
        ([key, value]) => {
          let string = "";
          string += `<span class="field-key">${key}</span>=`;
          string += `<span class="field-value">${value}</span>`;
          return string;
        }
      ).join(", ");
      result += `{${string_fields}}`;
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
