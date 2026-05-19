export class AstRenderer {
  constructor() {
    this.renderText = true;
    this.renderMarker = true;
    this.renderFields = true;
    this.maxTextLength = 30;
  }

  render(node, prefix = "") {
    let result = `[<span class="color-node-type">${node.type}</span>]`;
    const content = node.content;
    const fields = node.data.fields;
    if (this.renderMarker) {
      result += `[<span class="color-cursor-row">${content.start.row}</span>`;
      result += `:<span class="color-cursor-col">${content.start.col}</span>`;
      result += `-<span class="color-cursor-row">${content.end.row}</span>`;
      result += `:<span class="color-cursor-col">${content.end.col}</span>]`;
    }
    if (this.renderText) {
      let text = node.content.text.replace(/\r\n|\n/g, "\\n");
      if (text && text.length > this.maxTextLength) {
        text = text.slice(0, this.maxTextLength - 3) + "...";
      }
      const escaped_text = this.escapeHtml(text);
      const nowrap_text = escaped_text.replace(/\r\n|\n/g, "\\n");
      const render_text = nowrap_text;
      result += `("<span class="color-node-text">${render_text}</span>")`;
    }
    if (this.renderFields) {
      const string_fields = Object.entries(fields).map(
        ([key, value]) => {
          let string = "";
          string += `<span class="color-key">${key}</span>=`;
          string += `<span class="color-value">${value}</span>`;
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
