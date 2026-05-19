import { TextRuler } from "./text-ruler.js";

export class TextContext {
  constructor(text, ruler = new TextRuler()) {
    this.ruler = ruler;
    this.lines = text.replace(/\r\n?/g, "\n").split(/(?<=\n)/);
    this.numLines = this.lines.length;
    this.row = 0; // line number in text
    this.col = 0; // column number in line
    this.idx = 0; // index in line
  }

  eof() {
    return this.row >= this.lines.length;
  }

  current() {
    if (this.eof()) return null;
    return this.lines[this.row].slice(this.idx);
  }

  advance(n = 1) {
    if (this.row + n >= this.numLines) n = this.numLines - this.row;
    this.row += n;
    this.col = 0;
    this.idx = 0;
  }

  retreat(n = 1) {
    if (n > this.row) n = this.row;
    this.row -= n;
    this.col = 0;
    this.idx = 0;
  }

  consume(n = 1) {
    if (this.eof()) return;
    const width = this.ruler.measure(this.current().slice(0, n));
    this.col += width;
    this.idx += n;
  }
  
  capture() {
    return { idx: this.idx, row: this.row, col: this.col };
  }

  restore(cursor) {
    this.row = cursor.row;
    this.col = cursor.col;
    this.idx = cursor.idx;
  }
}
