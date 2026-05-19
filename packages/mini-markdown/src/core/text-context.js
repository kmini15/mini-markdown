import { TextRuler } from "./text-ruler.js";

export class TextContext {
  constructor(text, ruler = new TextRuler()) {
    this.ruler = ruler;
    this.lines = text.split(/(?<=\n)/);
    this.numLines = this.lines.length;
    this.row = 0; // line number in text
    this.col = 0; // column number in line
    this.idx = 0; // index in line
    this.offset = 0; // index in text
  }

  eof() {
    return this.row >= this.lines.length;
  }

  current() {
    if (this.eof()) return null;
    return this.lines[this.row].slice(this.idx);
  }

  advance() {
    if (this.eof()) return;
    this.offset += this.current().length;
    this.row += 1;
    this.col = 0;
    this.idx = 0;
  }

  retreat() {
    if (this.row === 0) return;
    this.offset -= this.idx;
    this.row -= 1;
    this.offset -= this.lines[this.row].length;
    this.col = 0;
    this.idx = 0;
  }

  consume(n = 1) {
    if (this.eof()) return;
    const text = this.current().slice(0, n);
    const shift = text.length;
    const width = this.ruler.measure(text);
    this.col += width;
    this.idx += shift;
    this.offset += shift;
  }

  capture() {
    return { idx: this.idx, row: this.row, col: this.col, offset: this.offset };
  }

  restore(cursor) {
    this.row = cursor.row;
    this.col = cursor.col;
    this.idx = cursor.idx;
    this.offset = cursor.offset;
  }
}
