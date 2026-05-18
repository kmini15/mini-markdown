import { Node } from "./node.js";
import * as textUtil from "./text-utils.js";

export class Inline {
  constructor(type, pattern) {
    this.type = type;
  }

  parse(node) {
    return;
  }

  bfs(root, visit) {
    const queue = [root];
    let head = 0;
    while (head < queue.length) {
      const node = queue[head++];
      visit(node);
      for (let child = node.firstChild; child; child = child.next) {
        queue.push(child);
      }
    }
  }

  dfs(root, visit) {
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      visit(node);
      const children = [];
      for (let child = node.firstChild; child; child = child.next) {
        children.push(child);
      }
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }

  split(node, pattern) {
    for (let child = node.firstChild; child;) {
      const next = child.next;
      if (child.type === "text") {
        const tokens = textUtil.split(child.content, pattern);
        for (let i = 0; i < tokens.length; i++) {
          const text = new Node("text");
          text.content = tokens[i];
          child.insertBefore(text);
        }
        child.unlink();
      }
      child = next;
    }
  }

  merge(node) {
    let child = node.firstChild;
    while (child && child.next) {
      if (child.type === "text" && child.next.type === "text") {
        child.content.text += child.next.content.text;
        child.content.end = child.next.content.end;
        child.next.unlink();
      } else {
        child = child.next;
      }
    }
  }
}
