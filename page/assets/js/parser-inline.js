import Node from "./node.js";

class ParserInline {
  constructor() {
    this.node = null;
    this.text = "";
    this.pos = 0;
    this.references = {};
    this.bracketStack = [];

    this.parsers = {
      "\\": this.parseEscape.bind(this),
      "\n": this.parseNewline.bind(this),
      "`": this.parseCode.bind(this),
      "[": this.parseBracketL.bind(this),
      "]": this.parseBracketR.bind(this),
      "!": this.parseBang.bind(this),
      "*": this.parseMarkAsterisk.bind(this),
      "_": this.parseMarkUnderscore.bind(this),
      "<": this.parseAutolink.bind(this),
    };

    this.patterns = {
      backticksOpen: /^`+/,
      backticksClose: /`+/,
      initSpace: /^\s*/,
      finiSpace: /\s*$/,
      chunk: /^[^\\\n`\[\]\!*_\<]+/,
      image: /^\(([^\)\]"]*)\s*("([^\)\]]*)")?\s*\)/,
      link: /^\(([^\)\]"]*)\s*("([^\)\]]*)")?\s*\)/,
      link_ref: /^\[([^\]]+)\]/,
      autolink_url: /^<([^>:]+:[^>]+)>/,
      autolink_email: /^<([^>@]+@[^>]+)>/,
      mark: /^(\*+|_+)/,
    };
  }

  parse(text, references = {}) {
    this.references = references;
    this.node = new Node("INLINE");
    this.text = text;
    this.pos = 0;
    this.parseInline();
    this.processMarks(this.node);
    this.processTexts(this.node); // Merge adjacent TEXT nodes
    return this.node;
  }

  parseInline() {
    let buffer = [];
    while (this.pos < this.text.length) {
      let result = false;
      for (const delim in this.parsers) {
        if (!this.text.startsWith(delim, this.pos)) {
          continue;
        }
        result = this.parsers[delim]();
        break;
      }
      if (!result) {
        result = this.parseText();
      }
      // fallback
      if (!result) {
        const node = new Node("TEXT");
        node.value = this.text[this.pos];
        this.node.appendChild(node);
        this.pos++;
      }
    }
    return true;
  }

  match(pattern) {
    const result = this.text.slice(this.pos).match(pattern);
    if (result) {
      this.pos += result.index + result[0].length;
      return result;
    }
    return null;
  }

  parseEscape() {
    if (this.pos + 1 >= this.text.length) {
      return false;
    }
    const nextChar = this.text[this.pos + 1];
    if (nextChar === "\n") {
      const node = new Node("HARD_BREAK");
      node.value = nextChar;
      this.node.appendChild(node);
      this.pos += 2;
      return true;
    } else {
      const node = new Node("TEXT");
      node.value = nextChar;
      this.node.appendChild(node);
      this.pos += 2;
      return true;
    }
  }

  parseNewline() {
    let isHardBreak = false;
    const lastChild = this.node.lastChild;
    if (lastChild && lastChild.type === "TEXT") {
      if (lastChild.value.endsWith("  ")) {
        isHardBreak = true;
      }
      lastChild.value = lastChild.value.replace(this.patterns.finiSpace, "");
    }
    const node = new Node(isHardBreak ? "HARD_BREAK" : "SOFT_BREAK");
    this.node.appendChild(node);
    this.pos++;
    this.match(this.patterns.initSpace);
    return true;
  }

  parseCode() {
    // Find the opening backticks.
    const openTicks = this.match(this.patterns.backticksOpen);
    if (openTicks === null) {
      return false;
    }
    const contentStart = this.pos;
    // Find the matching closing delimiter with the same number of backticks.
    let closeTicks = null;
    while (closeTicks = this.match(this.patterns.backticksClose)) {
      if (closeTicks[0].length === openTicks[0].length) {
        const contentEnd = this.pos - closeTicks[0].length;
        const node = new Node("CODE");
        node.value = this.text.slice(contentStart, contentEnd);
        this.node.appendChild(node);
        return true;
      }
    }
    // fallback: Push TEXT node with the opening backticks.
    this.pos = contentStart;
    const node = new Node("TEXT");
    node.value = openTicks[0];
    this.node.appendChild(node);
    return true;
  }

  parseBracketL() {
    const node = new Node("TEXT");
    node.value = "[";
    this.pos++;
    this.node.appendChild(node);
    this.bracketStack.push(node);
    return true;
  }

  parseBracketR() {
    // No matching open bracket, treat as literal
    if (this.bracketStack.length === 0) {
      const node = new Node("TEXT");
      node.value = "]";
      this.pos++;
      this.node.appendChild(node);
      return true;
    }
    this.pos++;
    const openNode = this.bracketStack.pop();
    const marker = openNode.prev ? openNode.prev.value : null;
    switch (marker) {
      case "!":
        if (this.parseBracketImage(openNode)) {
          openNode.prev.unlink(); // Unlink the "!" delimiter
          openNode.unlink(); // Unlink the "[" delimiter
          return true;
        }
        break;
      default:
        if (this.parseBracketLink(openNode)) {
          openNode.unlink(); // Unlink the "[" delimiter
          return true;
        }
        if (this.parseBracketLinkReference(openNode)) {
          openNode.unlink(); // Unlink the "[" delimiter
          return true;
        }
    }
    // fallback
    const node = new Node("TEXT");
    node.value = "]";
    this.node.appendChild(node);
    return true;
  }

  parseBracketImage(openNode) {
    const content = this.match(this.patterns.image);
    if (!content) return false;
    const imageNode = new Node("IMAGE");
    imageNode.fields.src = content[1];
    imageNode.fields.title = content[3] ? content[3] : "";
    for (let curr = openNode.next; curr; curr = curr.next) {
      imageNode.appendChild(curr);
      curr = openNode;
    }
    this.node.appendChild(imageNode);
    return true;
  }

  parseBracketLink(openNode) {
    const content = this.match(this.patterns.link);
    if (!content) return false;
    const node = new Node("LINK");
    node.fields.href = content[1];
    node.fields.title = content[3] ? content[3] : "";
    for (let curr = openNode.next; curr; curr = curr.next) {
      node.appendChild(curr);
      curr = openNode;
    }
    this.node.appendChild(node);
    return true;
  }

  parseBracketLinkReference(openNode) {
    const content = this.match(this.patterns.link_ref);
    if (!content) return false;
    const label = content[1].trim();
    const reference = this.references[label];
    if (!reference) return false;
    const { destination, title } = reference;
    const node = new Node("LINK");
    node.fields.href = destination;
    node.fields.title = title;
    for (let curr = openNode.next; curr; curr = curr.next) {
      node.appendChild(curr);
      curr = openNode;
    }
    this.node.appendChild(node);
    return true;
  }

  parseBang() {
    if (this.text[this.pos] === "!") {
      const node = new Node("TEXT");
      node.value = "!";
      this.pos++;
      this.node.appendChild(node);
      return true;
    }
    return false;
  }

  parseMarkAsterisk() {
    // Find the position of the previous character and the next character
    const pos_prev = this.pos - 1;
    const markers = this.match(this.patterns.mark);
    if (!markers) return false;
    const pos_next = this.pos;
    // Determine if the asterisk can open or close emphasis based on surrounding characters
    let open = false;
    let close = false;
    const char_prev = (pos_prev >= 0) ? this.text[pos_prev] : " ";
    const char_next = (pos_next < this.text.length) ? this.text[pos_next] : " ";
    open = !/\s/.test(char_next);
    close = !/\s/.test(char_prev);
    const node = new Node("MARK");
    node.value = markers[0];
    node.fields.marker = markers[0][0];
    node.fields.count = markers[0].length;
    node.fields.count_original = markers[0].length;
    node.fields.open = open;
    node.fields.close = close;
    this.node.appendChild(node);
    return true;
  }

  parseMarkUnderscore() {
    // Find the position of the previous character and the next character
    const pos_prev = this.pos - 1;
    const markers = this.match(this.patterns.mark);
    if (!markers) return false;
    const pos_next = this.pos;
    // Determine if the underscore can open or close emphasis based on surrounding characters
    let open = false;
    let close = false;
    const char_prev = (pos_prev >= 0) ? this.text[pos_prev] : " ";
    const char_next = (pos_next < this.text.length) ? this.text[pos_next] : " ";
    open = !/\s/.test(char_next) && /\s|_|\*/.test(char_prev);
    close = !/\s/.test(char_prev) && /\s|_|\*/.test(char_next);
    const node = new Node("MARK");
    node.value = markers[0];
    node.fields.marker = markers[0][0];
    node.fields.count = markers[0].length;
    node.fields.count_original = markers[0].length;
    node.fields.open = open;
    node.fields.close = close;
    this.node.appendChild(node);
    return true;
  }

  parseAutolink() {
    const autolink_url = this.match(this.patterns.autolink_url)
    if (autolink_url) {
      const node = new Node("LINK");
      node.fields.href = autolink_url[1];
      node.fields.title = "";
      const textNode = new Node("TEXT");
      textNode.value = autolink_url[1];
      node.appendChild(textNode);
      this.node.appendChild(node);
      return true;
    }
    const autolink_email = this.match(this.patterns.autolink_email);
    if (autolink_email) {
      const node = new Node("LINK");
      node.fields.href = "mailto:" + autolink_email[1];
      node.fields.title = "";
      const textNode = new Node("TEXT");
      textNode.value = autolink_email[1];
      node.appendChild(textNode);
      this.node.appendChild(node);
      return true;
    }
    return false;
  }

  parseText() {
    const text = this.match(this.patterns.chunk);
    if (text) {
      const node = new Node("TEXT");
      node.value = text[0];
      this.node.appendChild(node);
      return true;
    }
    return false;
  }

  processMarks(node) {
    const markList = new Node("MARK_LIST");
    for (let child = node.firstChild; child; child = child.next) {
      const result = this.processMarks(child);
      if (result.type === "MARK") {
        const markNode = new Node("MARK_NODE");
        markNode.fields.node = result;
        markList.appendChild(markNode);
      }
    }
    while (markList.firstChild) {
      markList.firstChild.fields.node.fields.close = false;
      markList.lastChild.fields.node.fields.open = false;
      let openMarkNode = markList.firstChild;
      let closeMarkNode = markList.firstChild.next;
      let matched = false;
      while (openMarkNode && closeMarkNode) {
        // Check if the open and close markers can form a valid emphasis.
        const openNode = openMarkNode.fields.node;
        const closeNode = closeMarkNode.fields.node;
        const openCount = openNode.fields.count;
        const closeCount = closeNode.fields.count;
        const openCountOriginal = openNode.fields.count_original;
        const closeCountOriginal = closeNode.fields.count_original;
        const rule0 = openNode.fields.open && openNode.fields.close;
        const rule1 = closeNode.fields.open && closeNode.fields.close;
        const rule2 = (openCountOriginal + closeCountOriginal) % 3 === 0;
        const rule3 = openCountOriginal % 3 !== 0;
        const rule4 = closeCountOriginal % 3 !== 0;
        const ruleOf3 = (rule0 || rule1) && rule2 && (rule3 || rule4);
        if (!openNode.fields.open) {
          break;
        }
        if (!closeNode.fields.close || ruleOf3) {
          if (closeNode.fields.open) {
            openMarkNode = closeMarkNode;
          }
          closeMarkNode = closeMarkNode.next;
          continue;
        }
        // convert the matched markers to BOLD or ITALIC nodes.
        if (openCount >= 2 && closeCount >= 2) {
          const boldNode = new Node("BOLD");
          for (let curr = openNode.next; curr !== closeNode;) {
            let temp = curr.next;
            boldNode.appendChild(curr);
            curr = temp;
          }
          openNode.fields.count -= 2;
          closeNode.fields.count -= 2;
          openNode.value = openNode.value.slice(2);
          closeNode.value = closeNode.value.slice(2);
          openNode.insertAfter(boldNode);
        } else if (openCount >= 1 && closeCount >= 1) {
          const italicNode = new Node("ITALIC");
          for (let curr = openNode.next; curr !== closeNode;) {
            let temp = curr.next;
            italicNode.appendChild(curr);
            curr = temp;
          }
          openNode.fields.count -= 1;
          closeNode.fields.count -= 1;
          openNode.value = openNode.value.slice(1);
          closeNode.value = closeNode.value.slice(1);
          openNode.insertAfter(italicNode);
        }
        // remove the markers if their count drops to 0.
        if (openNode.fields.count === 0) {
          openNode.unlink();
          openMarkNode.unlink();
        }
        if (closeNode.fields.count === 0) {
          closeNode.unlink();
          closeMarkNode.unlink();
        }
        matched = true;
        break;
      }
      // convert unmatched markers back to TEXT nodes
      if (!matched) {
        const textNode = new Node("TEXT");
        textNode.value = openMarkNode.fields.node.value;
        openMarkNode.fields.node.insertBefore(textNode);
        openMarkNode.fields.node.unlink();
        openMarkNode.unlink();
      }
    }
    return node;
  }

  processTexts(node) {
    for (let child = node.firstChild; child; child = child.next) {
      this.processTexts(child);
    }
    for (let child = node.firstChild; child;) {
      if (child.type === "TEXT" && child.next && child.next.type === "TEXT") {
        child.value += child.next.value;
        child.next.unlink();
        continue;
      }
      child = child.next;
    }
  }
}

export default ParserInline;