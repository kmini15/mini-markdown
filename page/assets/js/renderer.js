import Node from "./node.js";

class Renderer {
  constructor() { }
  render(node) {
    let text = "";
    for (let child = node.firstChild; child; child = child.next) {
      if (node.type === "LIST_ITEM" && child.type === "PARAGRAPH") {
        text += this.render(child.firstChild);
      } else {
        text += this.render(child);
      }
    }
    switch (node.type) {
      // BLOCK
      case "HTML":
        return text;
      case "LIST":
        if (node.fields.ordered) {
          return `<ol>\n${text}</ol>\n`;
        } else {
          return `<ul>\n${text}</ul>\n`;
        }
      case "LIST_ITEM":
        return `<li>${text}</li>\n`;
      case "CODE_BLOCK":
        var language = node.fields.language ? ` class="language-${node.fields.language}"` : "";
        return `<pre><code${language}>${this.escapeHtml(text)}\n</code></pre>\n`;
      case "BLOCKQUOTE":
        return `<blockquote>\n${text}</blockquote>\n`;
      case "HEADING":
        return `<h${node.fields.level}>${text}</h${node.fields.level}>\n`;
      case "HORIZONTAL_RULE":
        return "<hr>\n";
      case "GRID":
        var style = "";
        style += `--columns: ${node.fields.columns};`;
        style += `--gap: ${node.fields.gap};`;
        return `<div class="grid" style="${style}">\n${text}</div>\n`;
      case "GRID_ITEM":
        return `<div class="grid-item">${text}</div>\n`;
      case "TABLE":
        return `<table>\n${text}</table>\n`;
      case "TABLE_ROW":
        return `<tr>\n${text}</tr>\n`;
      case "TABLE_HEADER_CELL":
        var rowspan = node.fields.rowSpan > 1 ? ` rowspan="${node.fields.rowSpan}"` : "";
        var colspan = node.fields.colSpan > 1 ? ` colspan="${node.fields.colSpan}"` : "";
        var style = "";
        if (node.fields.alignH) {
          style += `text-align: ${node.fields.alignH};`;
        }
        if (node.fields.alignV) {
          style += `vertical-align: ${node.fields.alignV};`;
        }
        if (style) {
          style = ` style="${style}"`;
        }
        return `<th${rowspan}${colspan}${style}>${text}</th>\n`;
      case "TABLE_CELL":
        var rowspan = node.fields.rowSpan > 1 ? ` rowspan="${node.fields.rowSpan}"` : "";
        var colspan = node.fields.colSpan > 1 ? ` colspan="${node.fields.colSpan}"` : "";
        var style = "";
        if (node.fields.alignH) {
          style += `text-align: ${node.fields.alignH};`;
        }
        if (node.fields.alignV) {
          style += `vertical-align: ${node.fields.alignV};`;
        }
        if (style) {
          style = ` style="${style}"`;
        }
        return `<td${rowspan}${colspan}${style}>${text}</td>\n`;
      case "PARAGRAPH":
        return `<p>${text}</p>\n`;
      // INLINE
      case "HARD_BREAK":
        return "<br>\n";
      case "SOFT_BREAK":
        return "\n";
      case "CODE":
        return "<code>" + this.escapeHtml(node.value) + "</code>";
      case "IMAGE":
        var alt = text;
        var src = node.fields.src || "";
        var title = node.fields.title ? ` title="${node.fields.title}"` : "";
        return `<img src="${src}" alt="${alt}"${title}>`;
      case "LINK":
        var anchor = text;
        var href = node.fields.href || "";
        var title = node.fields.title ? ` title="${node.fields.title}"` : "";
        return `<a href="${href}"${title}>${anchor}</a>`;
      case "BOLD":
        return `<strong>${text}</strong>`;
      case "ITALIC":
        return `<em>${text}</em>`;
      case "TEXT":
        return node.value;
      case "INLINE":
        return text;
    }
    return text;
  }

  escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}


export default Renderer;