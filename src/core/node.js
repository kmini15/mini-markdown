export class Node {
  constructor(type, lazy = false) {
    this.parent = null;
    this.firstChild = null;
    this.lastChild = null;
    this.prev = null;
    this.next = null;
    this.data = {
      type: type,
      lazy: lazy,
      token: { text: null, start: null, end: null },
      fields: {},
    };
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
}
