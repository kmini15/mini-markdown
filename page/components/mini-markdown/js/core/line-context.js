import TextWidth from "./text-width.js";

class LineContext {
  constructor(line) {
    this.line = line;
    this.index = 0;
    this.column = 0;
    this.indexCapture = 0;
    this.columnCapture = 0;
    this.textWidth = new TextWidth();
  }

  eof() {
    return this.index >= this.line.length;
  }

  current() {
    if (this.eof()) return null;
    return this.line[this.index];
  }

  advance(n = 1) {
    this.column += this.textWidth.measure(this.line.slice(this.index, this.index + n));
    this.index += n;
  }

  retreat(n = 1) {
    this.index -= n;
    this.column -= this.textWidth.measure(this.line.slice(this.index, this.index + n));
  }

  capture() {
    this.indexCapture = this.index;
    this.columnCapture = this.column;
  }

  restore() {
    this.index = this.indexCapture;
    this.column = this.columnCapture;
  }

  remains() {
    if (this.eof()) return "";
    return this.line.slice(this.index);
  }
}

export default LineContext;