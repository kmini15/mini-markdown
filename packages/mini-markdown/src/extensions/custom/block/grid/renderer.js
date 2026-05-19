import { Renderer } from "../../../../core/renderer.js";

export class GridRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    if (node.data.fields.width) {
      style += `--width: ${node.data.fields.width};`;
    }
    if (node.data.fields.gap) {
      style += `--gap: ${node.data.fields.gap};`;
    }
    if (node.data.fields.columns) {
      let columns = node.data.fields.columns.split(" ");
      if (columns.length == 1) {
        columns[0] = `repeat(${columns[0]}, minmax(0, 1fr))`;
      } else {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i] == "auto") {
            columns[i] = `minmax(0, ${columns[i]})`;
          } else if (columns[i].endsWith("fr")) {
            columns[i] = `minmax(0, ${columns[i]})`;
          } else if (columns[i].endsWith("%")) {
            columns[i] = `minmax(0, ${columns[i]})`;
          } else if (columns[i].endsWith("px")) {
            columns[i] = `minmax(0, ${columns[i]})`;
          } else {
            columns[i] = `minmax(0, ${columns[i]}fr)`;
          }
        }
      }
      style += `--columns: ${columns.join(" ")};`;
    }
    if (node.data.fields.style) {
      style += node.data.fields.style;
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}

export class GridItemRenderer extends Renderer {
  constructor(type) {
    super(type);
  }

  render(text, node) {
    let style = "";
    switch (node.data.fields.align) {
      case "[' ]":
        style += "--align-v: start; --align-h: start;";
        break;
      case "['']":
        style += "--align-v: start; --align-h: center;";
        break;
      case "[ ']":
        style += "--align-v: start; --align-h: end;";
        break;
      case "[: ]":
        style += "--align-v: center; --align-h: start;";
        break;
      case "[::]":
        style += "--align-v: center; --align-h: center;";
        break;
      case "[ :]":
        style += "--align-v: center; --align-h: end;";
        break;
      case "[. ]":
        style += "--align-v: end; --align-h: start;";
        break;
      case "[..]":
        style += "--align-v: end; --align-h: center;";
        break;
      case "[ .]":
        style += "--align-v: end; --align-h: end;";
        break;
    }
    if (node.data.fields.style) {
      style += node.data.fields.style.slice(1, -1);
    }
    if (style) {
      style = `style="${style}"`;
    }
    return `<div class="${this.type}" ${style}>\n${text}</div>\n`;
  }
}
