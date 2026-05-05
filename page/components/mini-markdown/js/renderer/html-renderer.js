import Node from "../core/node.js";

class HtmlRenderer {
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
      case "FENCED_CODE_BLOCK":
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
        style += this.alignFieldsToFlexAlign(node);
        return `<div class="grid-item" style="${style}">${text}</div>\n`;
      case "TABLE":
        return `<table>\n${text}</table>\n`;
      case "TABLE_ROW":
        return `<tr>\n${text}</tr>\n`;
      case "TABLE_HEADER":
        var style = "";
        style += this.alignFieldsToFlexAlign(node);
        return `<th style="${style}">${text}</th>\n`;
      case "TABLE_DATA":
        var style = "";
        style += this.alignFieldsToFlexAlign(node);
        return `<td style="${style}">${text}</td>\n`;
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
        style += this.alignFieldsToFlexAlign(node);
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
        style += this.alignFieldsToFlexAlign(node);
        var row = "row-" + (row % 2 === 1 ? "odd" : "even");
        return `<div class="grid-table-cell grid-table-data ${row}" style="${style}">${text}</div>\n`;
      case "SCROLL":
        return `<div class="scroll">\n${text}</div>\n`;
      case "JUSTIFIED_ROW":
        var style = "";
        style += `--width: ${node.fields.width};`;
        style += `--gap: ${node.fields.gap};`;
        return `<div class="justified-row" style="${style}">\n${text}</div>\n`;
      case "JUSTIFIED_ROW_ITEM":
        return `<div class="justified-row-item">\n${text}</div>\n`;
      case "JUSTIFIED_COL":
        var style = "";
        style += `--height: ${node.fields.height};`;  
        style += `--gap: ${node.fields.gap};`;
        return `<div class="justified-col" style="${style}">\n${text}</div>\n`;
      case "JUSTIFIED_COL_ITEM":
        return `<div class="justified-col-item">\n${text}</div>\n`;
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

  alignTextHToFlexAlign(align) {
    switch (align) {
      case "left":
        return "left";
      case "center":
        return "center";
      case "right":
        return "right";
      default:
        return null;
    }
  }

  alignTextVToFlexAlign(align) {
    switch (align) {
      case "top":
        return "top";
      case "middle":
        return "center";
      case "bottom":
        return "bottom";
      default:
        return null;
    }
  }

  alignItemHToFlexAlign(align) {
    switch (align) {
      case "left":
        return "start";
      case "center":
        return "center";
      case "right":
        return "end";
      default:
        return null;
    }
  }

  alignItemVToFlexAlign(align) {
    switch (align) {
      case "top":
        return "start";
      case "middle":
        return "center";
      case "bottom":
        return "end";
      default:
        return null;
    }
  }

  alignFieldsToFlexAlign(node) {
    var style = "";
    if (node.fields.alignTextH) {
      style += `--align-text-h: ${this.alignTextHToFlexAlign(node.fields.alignTextH)};`;
    }
    if (node.fields.alignTextV) {
      style += `--align-text-v: ${this.alignTextVToFlexAlign(node.fields.alignTextV)};`;
    }
    if (node.fields.alignItemH) {
      style += `--align-item-h: ${this.alignItemHToFlexAlign(node.fields.alignItemH)};`;
    }
    if (node.fields.alignItemV) {
      style += `--align-item-v: ${this.alignItemVToFlexAlign(node.fields.alignItemV)};`;
    }
    return style;
  }
}


export default HtmlRenderer;