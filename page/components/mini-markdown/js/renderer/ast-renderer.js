import Node from "../core/node.js";

class AstRenderer {
  render(node, indent = "") {
    let result = "[" + node.type + "]";
    if (node.value.length > 0) {
      const text_value = node.value.replace(/(\r\n)|(\n)/g, "<br>");
      result += `("${text_value}")`;
    }
    const field_keys = Object.keys(node.fields);
    if (field_keys.length > 0) {
      const field_strings = field_keys.map(key => `${key}="${node.fields[key]}"`);
      result += `{${field_strings.join(", ")}}`;
    }
    result += "\n";
    for (let child = node.firstChild; child; child = child.next) {
      if (child === node.lastChild) {
        result += indent + "└──" + this.render(child, indent + "   ");
      } else {
        result += indent + "├──" + this.render(child, indent + "│  ");
      }
    }
    return result;
  }
}

export default AstRenderer;