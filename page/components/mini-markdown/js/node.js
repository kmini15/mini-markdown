class Node {
  constructor(type) {
    this.parent = null;
    this.firstChild = null;
    this.lastChild = null;
    this.prev = null;
    this.next = null;

    this.type = type;
    this.value = "";
    this.fields = {};
  }

  unlink() {
    if (this.prev) {
      this.prev.next = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    }
    if (this.parent) {
      if (this.parent.firstChild === this) {
        this.parent.firstChild = this.next;
      }
      if (this.parent.lastChild === this) {
        this.parent.lastChild = this.prev;
      }
    }
    this.parent = null;
    this.prev = null;
    this.next = null;
  }

  prependChild(node) {
    node.unlink();
    node.parent = this;
    if (this.firstChild) {
      this.firstChild.prev = node;
      node.next = this.firstChild;
    } else {
      this.lastChild = node;
    }
    this.firstChild = node;
  }

  appendChild(node) {
    node.unlink();
    node.parent = this;
    if (this.lastChild) {
      this.lastChild.next = node;
      node.prev = this.lastChild;
    } else {
      this.firstChild = node;
    }
    this.lastChild = node;
  }

  insertBefore(node) {
    node.unlink();
    node.parent = this.parent;
    if (this.prev) {
      this.prev.next = node;
      node.prev = this.prev;
    } else if (this.parent) {
      this.parent.firstChild = node;
    }
    node.next = this;
    this.prev = node;
  }

  insertAfter(node) {
    node.unlink();
    node.parent = this.parent;
    if (this.next) {
      this.next.prev = node;
      node.next = this.next;
    } else if (this.parent) {
      this.parent.lastChild = node;
    }
    node.prev = this;
    this.next = node;
  }

  dumpString(indent = "") {
    let result = "[" + this.type + "]";
    if (this.value.length > 0) {
      const text_value = this.value.replace(/(\r\n)|(\n)/g, "<br>");
      result += `("${text_value}")`;
    }
    const field_keys = Object.keys(this.fields);
    if (field_keys.length > 0) {
      const field_strings = field_keys.map(key => `${key}="${this.fields[key]}"`);
      result += `{${field_strings.join(", ")}}`;
    }
    result += "\n";
    for (let child = this.firstChild; child; child = child.next) {
      if (child === this.lastChild) {
        result += indent + "└──" + child.dumpString(indent + "   ");
      } else {
        result += indent + "├──" + child.dumpString(indent + "│  ");
      }
    }
    return result;
  }
}

export default Node;