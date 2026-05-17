export class TextRuler {
  constructor(rules = TextRuler.defaultRules()) {
    this.rules = rules;
  }

  static defaultRules() {
    return [
      { pattern: /[\uAC00-\uD7A3]/u, width: 2 }, // 한글 음절
      { pattern: /[\u1100-\u11FF]/u, width: 2 }, // 한글 자모
      { pattern: /[\u3130-\u318F]/u, width: 2 }, // 호환 자모
      { pattern: /[\u3000-\u303F]/u, width: 2 }, // CJK 문장부호
      { pattern: /[\u4E00-\u9FFF]/u, width: 2 }, // 한자
      { pattern: /[\u3040-\u30FF]/u, width: 2 }, // 일본어
      { pattern: /[\uFF01-\uFF60]/u, width: 2 }, // 전각 ASCII/문장부호
      { pattern: /[\uFFE0-\uFFE6]/u, width: 2 }, // 전각 기호
    ];
  }

  getCharWidth(char) {
    for (const rule of this.rules) {
      if (rule.pattern.test(char)) {
        return rule.width;
      }
    }
    return 1;
  }

  measure(text) {
    let width = 0;
    for (const char of text) {
      width += this.getCharWidth(char);
    }
    return width;
  }

  indexAtColumn(text, targetColumn) {
    let column = 0;
    for (let i = 0; i < text.length; i++) {
      const charWidth = this.getCharWidth(text[i]);
      if (column + charWidth > targetColumn) {
        return i;
      }
      column += charWidth;
    }
    return text.length;
  }

  columnAtIndex(text, index) {
    let column = 0;
    for (let i = 0; i < index; i++) {
      column += this.getCharWidth(text[i]);
    }
    return column;
  }

  padEnd(text, targetWidth, fill = " ") {
    const width = this.measure(text);
    const padding = Math.max(0, targetWidth - width);
    return text + fill.repeat(padding);
  }

  padStart(text, targetWidth, fill = " ") {
    const width = this.measure(text);
    const padding = Math.max(0, targetWidth - width);
    return fill.repeat(padding) + text;
  }
}
