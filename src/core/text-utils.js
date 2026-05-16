import { TextRuler } from "./text-ruler.js";

const textRuler = new TextRuler();

function advance(text, start, ruler = textRuler) {
    let row = start.row;
    let col = start.col;
    let idx = start.idx;

    for (const ch of text) {
      if (ch === "\n") {
        row++;
        col = 0;
        idx = 0;
      } else {
        col += ruler.getCharWidth(ch);
        idx++;
      }
    }

    return { row, col, idx };
  }

export function split(token, pattern, ruler = textRuler) {
  const chunks = token.text
    .split(pattern)
    .filter(chunk => chunk !== "");

  const tokens = [];
  let currentStart = { ...token.start };

  for (const chunk of chunks) {
    const start = { ...currentStart };
    const end = advance(chunk, start, ruler);
    const token = {
      text: chunk,
      start: start,
      end: end,
    };
    tokens.push(token);
    currentStart = { ...end };
  }

  return tokens;
}
