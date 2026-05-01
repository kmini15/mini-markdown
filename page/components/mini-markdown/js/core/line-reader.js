class LineReader {
  constructor(text) {
    this.lines = text.replace(/\r\n?/g, "\n").split("\n");
    this.pos = 0;
    this.posCapture = 0;
  }

  eof() {
    return this.pos >= this.lines.length;
  }

  current() {
    if (this.eof()) return null;
    return this.lines[this.pos];
  }

  advance() {
    if (this.eof()) return null;
    this.pos++;
  }

  retreat() {
    if (this.pos <= 0) return null;
    this.pos--;
  }

  capture() {
    this.posCapture = this.pos;
  }

  restore() {
    this.pos = this.posCapture;
  }
}

export default LineReader;