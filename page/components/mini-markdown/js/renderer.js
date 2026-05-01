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
        var style = "";
        if (node.fields.alignTextH) {
          style += `--align-text-h: ${node.fields.alignTextH};`;
        }
        if (node.fields.alignTextV) {
          style += `--align-text-v: ${node.fields.alignTextV};`;
        }
        if (node.fields.alignItemH) {
          style += `--align-item-h: ${node.fields.alignItemH};`;
        }
        if (node.fields.alignItemV) {
          style += `--align-item-v: ${node.fields.alignItemV};`;
        }
        return `<div class="grid-item" style="${style}">${text}</div>\n`;
      case "TABLE":
        return `<table>\n${text}</table>\n`;
      case "TABLE_ROW":
        return `<tr>\n${text}</tr>\n`;
      case "TABLE_HEADER":
        var style = "";
        if (node.fields.align) {
          style = ` style="text-align: ${node.fields.align};"`;
        }
        return `<th${style}>${text}</th>\n`;
      case "TABLE_DATA":
        var style = "";
        if (node.fields.align) {
          style = ` style="text-align: ${node.fields.align};"`;
        }
        return `<td${style}>${text}</td>\n`;
      case "GRID_TABLE":
        var columns = node.fields.columns ?? 1;
        return `<div class="grid-table" style="--columns:${columns};">\n${text}</div>\n`;
      case "GRID_TABLE_ROW":
        return text;
      case "GRID_TABLE_HEADER":
        var row = node.fields.row ?? 1;
        var col = node.fields.col ?? 1;
        var rowSpan = node.fields.rowSpan ?? 1;
        var colSpan = node.fields.colSpan ?? 1;
        var style = "";
        style += `--row:${row};`;
        style += `--col:${col};`;
        style += `--row-span:${rowSpan};`;
        style += `--col-span:${colSpan};`;
        if (node.fields.alignTextH) {
          style += `--align-text-h: ${node.fields.alignTextH};`;
        }
        if (node.fields.alignTextV) {
          style += `--align-text-v: ${node.fields.alignTextV};`;
        }
        if (node.fields.alignItemH) {
          style += `--align-item-h: ${node.fields.alignItemH};`;
        }
        if (node.fields.alignItemV) {
          style += `--align-item-v: ${node.fields.alignItemV};`;
        }
        var row = "row-" + (row % 2 === 1 ? "odd" : "even");
        return `<div class="grid-table-cell grid-table-header ${row}" style="${style}">${text}</div>\n`;
      case "GRID_TABLE_DATA":
        var row = node.fields.row ?? 1;
        var col = node.fields.col ?? 1;
        var rowSpan = node.fields.rowSpan ?? 1;
        var colSpan = node.fields.colSpan ?? 1;
        var style = "";
        style += `--row:${row};`;
        style += `--col:${col};`;
        style += `--row-span:${rowSpan};`;
        style += `--col-span:${colSpan};`;
        if (node.fields.alignTextH) {
          style += `--align-text-h: ${node.fields.alignTextH};`;
        }
        if (node.fields.alignTextV) {
          style += `--align-text-v: ${node.fields.alignTextV};`;
        }
        if (node.fields.alignItemH) {
          style += `--align-item-h: ${node.fields.alignItemH};`;
        }
        if (node.fields.alignItemV) {
          style += `--align-item-v: ${node.fields.alignItemV};`;
        }
        var row = "row-" + (row % 2 === 1 ? "odd" : "even");
        return `<div class="grid-table-cell grid-table-data ${row}" style="${style}">${text}</div>\n`;
      case "SCROLL":
        return `<div class="scroll">\n${text}</div>\n`;
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