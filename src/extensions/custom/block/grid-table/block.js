import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

/*
open line:  +----------+----------+----------+  <= patternOpen
cell line:  | Header 1 | Header 2 | Header 3 |  <= patternCell
mark line:  |:========:+'========'+.========.|  <= patternHead
cell line:  | Cell 1   | Cell 2   | Cell 3   |  <= patternCell
mark line:  +:--------:+'--------'+.--------.+  <= patternData
cell line:  | Cell 3   | Cell 4   | Cell 5   |  <= patternCell
mark line:  |          | Span     |          |  <= patternSpan
cell line:  | Cell 6   | Cell 7   | Cell 8   |  <= patternCell
mark line:  +----------+----------+----------+  <= patternData

1. parse columns from the open line.
2. For each row:
  2-1. parse cell col and row spans from the cell line.
  2-2. parse mark from the mark line.
  2-3. parse cell text from the cell line,
       and if the mark is span, append the mark line text to the cell text.
  2-4. determine cell alignment from the mark line.
3. Build the table node with the parsed information.


Example of a grid table with various alignments, spans, and headers:
+-------+-------+-------+-------+-------+-------+--------+ 
| Grid Table Test                                        | 
+:======================================================:+ 
| Left Top      | Center Top    | Right Top     | Item1  |
|               |               |               |:-------| 
|               |               |               | Item2  |
|'--------------+'-------------'+--------------'+:------:+
| Left Middle   | Center Middle | Right Middle  | Item3  |
|               |               |               |-------:|
|               |               |               | Item4  |
|:--------------+:-------------:+--------------:|.------.|
| Left Bottom   | Center Bottom | Right Bottom  | Item5  |
|               |               |               |.-------|
|               |               |               | Header |
|.------+-------+.------+------.+--------------.|:======:|
|       |       |       |       |       |       |        |
|-------+-------+-------+-------+-------+-------|        |
|  Merged Cell  |       |         Merged\       |        |
|-------+-------+-------|   Header              |--------|
|       |  Merged Cell  |       Cell            |        |
+-------+---------------+:=====================:+--------+
*/

class GridTableRule extends Block {
  constructor(type) {
    super(type);
    this.patternOpen = /^[+][+-]+[+]$/;
    this.patternCell = /^[|](.+)[|]$/;
    this.patternMark = /^[|+](.+)[|+]$/;
    this.patternHead = /^([:'.=])[+=]+([:'.=])$/;
    this.patternData = /^([:'.-])[+-]+([:'.-])$/;
    this.ruler = null;
  }

  parse(context, parent) {
    this.ruler = context.input.ruler;
    const capture = context.input.capture();
    const openLine = context.input.current()?.trim();
    if (!openLine) return null;
    const openMatch = openLine.match(this.patternOpen);
    if (!openMatch) return null;
    const columns = this.parseColumns(openLine);
    const tableRows = [];
    while (!context.input.eof()) {
      const capture = context.input.capture();
      context.input.advance();
      const cellLine = context.input.current()?.trim();
      context.input.advance();
      const markLine = context.input.current()?.trim();
      if (!cellLine || !markLine) {
        context.input.restore(capture);
        break;
      }
      const tableRow = this.parseTableRow(columns, cellLine, markLine);
      if (!tableRow) {
        context.input.restore(capture);
        break;
      }
      tableRows.push(tableRow);
    }
    if (tableRows.length === 0) {
      context.input.restore(capture);
      return null;
    }
    const tableNode = this.buildTableNode(tableRows);
    if (!tableNode) {
      context.input.restore(capture);
      return null;
    }
    context.input.consume(context.input.current().length);
    return tableNode;
  }

  parseColumns(openLine) {
    const widths = openLine
      .split("+")
      .slice(1, -1)
      .map(segment => segment.trim())
      .map(segment => this.ruler.measure(segment));
    let offset = 0;
    return widths.map(width => {
      const bound = {
        start: offset + 1,
        end: offset + width + 1,
      };
      offset = bound.end;
      return bound;
    });
  }

  parseTableRow(columns, cellLine, markLine) {
    const tableWidth = columns[columns.length - 1].end + 1;
    if (this.ruler.measure(cellLine) !== tableWidth || this.ruler.measure(markLine) !== tableWidth) {
      return null; // Line length does not match expected table width
    }
    if (!this.patternCell.test(cellLine)) return null;
    if (!this.patternMark.test(markLine)) return null;
    const colSpans = [];
    const rowSpans = [];
    let colSpan = 0;
    for (let i = 0; i < columns.length; i++) {
      const index = this.ruler.indexAtColumn(cellLine, columns[i].end);
      if (cellLine[index] === "|") {
        colSpans.push(colSpan + 1);
        colSpans.push(...Array(colSpan).fill(0));
        rowSpans.push(1);
        rowSpans.push(...Array(colSpan).fill(1));
        colSpan = 0;
      } else {
        colSpan++;
      }
    }
    const marks = [];
    const texts = [];
    const aligns = [];
    for (let i = 0; i < columns.length; i++) {
      if (colSpans[i] === 0) {
        marks.push(null); // This column is spanned, so no mark
        texts.push(null); // This column is spanned, so no text
        aligns.push(null); // This column is spanned, so no align
        continue;
      }
      const markStart = this.ruler.indexAtColumn(markLine, columns[i].start);
      const markEnd = this.ruler.indexAtColumn(markLine, columns[i + colSpans[i] - 1].end);
      const segment = markLine.slice(markStart, markEnd);
      let mark = "span";
      mark = this.patternHead.test(segment) ? "head" : mark;
      mark = this.patternData.test(segment) ? "data" : mark;
      marks.push(mark);
      const cellStart = this.ruler.indexAtColumn(cellLine, columns[i].start);
      const cellEnd = this.ruler.indexAtColumn(cellLine, columns[i + colSpans[i] - 1].end);
      let text = cellLine.slice(cellStart, cellEnd).trim();
      if (mark === "span") {
        text += "\n" + markLine.slice(markStart, markEnd).trim();
      }
      texts.push(text);
      let align = {
        alignH: "none",
        alignV: "none",
      };
      if (mark === "head" || mark === "data") {
        const alignMarkL = /[=-]/.test(segment.at(0)) ? " " : segment.at(0);
        const alignMarkR = /[=-]/.test(segment.at(-1)) ? " " : segment.at(-1);
        const alignMark = alignMarkL + alignMarkR;
        align = this.getAlignmentFromMark(alignMark);
      }
      aligns.push(align);
    }
    const tableRow = {
      colSpans: colSpans,
      rowSpans: rowSpans,
      marks: marks,
      texts: texts,
      aligns: aligns,
    };
    return tableRow;
  }

  buildTableNode(tableRows) {
    const numCols = tableRows[0].colSpans.length;
    const tableNode = new Node("grid-table");
    tableNode.data.token = {
      text: "",
      start: { row: 0, col: 0, idx: 0 },
      end: { row: 0, col: 0, idx: 0 },
    }
    tableNode.data.fields = {
      columns: numCols,
    };
    for (let row = 0; row < tableRows.length; row++) {
      const rowNode = new Node("grid-table-row");
      rowNode.data.token = {
        text: "",
        start: { row: 0, col: 0, idx: 0 },
        end: { row: 0, col: 0, idx: 0 },
      }
      tableNode.appendChild(rowNode);
      const tableRow = tableRows[row];
      for (let col = 0; col < tableRow.colSpans.length; col++) {
        if (tableRow.colSpans[col] === 0 || tableRow.rowSpans[col] === 0) {
          continue; // Skip cells covered by spans
        }
        let text = tableRow.texts[col];
        let rowIndex = row;
        while (tableRows[rowIndex].marks[col] === "span") {
          rowIndex++;
          if (rowIndex >= tableRows.length) {
            return null; // Span extends beyond the last row
          }
          if (tableRows[rowIndex].colSpans[col] !== tableRows[row].colSpans[col]) {
            return null; // Inconsistent column span for spanned cell
          }
          text += "\n" + tableRows[rowIndex].texts[col];
          tableRows[rowIndex].rowSpans[col] = 0;
          tableRows[row].rowSpans[col]++;
        }
        const textNode = new Node("text");
        textNode.data.token = {
          text: text,
          start: { row: 0, col: 0, idx: 0 },
          end: { row: 0, col: 0, idx: 0 },
        };
        const cellNode = new Node("grid-table-cell");
        cellNode.data.token = {
          text: "",
          start: { row: 0, col: 0, idx: 0 },
          end: { row: 0, col: 0, idx: 0 },
        };
        cellNode.data.fields = {
          rowSpan: tableRow.rowSpans[col],
          colSpan: tableRow.colSpans[col],
          header: tableRows[rowIndex].marks[col] === "head",
          alignH: tableRows[rowIndex].aligns[col].alignH,
          alignV: tableRows[rowIndex].aligns[col].alignV,
        };
        cellNode.appendChild(textNode);
        rowNode.appendChild(cellNode);
      }
    }
    return tableNode;
  }

  getAlignmentFromMark(mark) {
    let align = {
      alignH: "none",
      alignV: "none",
    };
    switch (mark) {
      case "' ":
        align.alignH = "left";
        align.alignV = "top";
        break;
      case "''":
        align.alignH = "center";
        align.alignV = "top";
        break;
      case " '":
        align.alignH = "right";
        align.alignV = "top";
        break;
      case ": ":
        align.alignH = "left";
        align.alignV = "middle";
        break;
      case "::":
        align.alignH = "center";
        align.alignV = "middle";
        break;
      case " :":
        align.alignH = "right";
        align.alignV = "middle";
        break;
      case ". ":
        align.alignH = "left";
        align.alignV = "bottom";
        break;
      case "..":
        align.alignH = "center";
        align.alignV = "bottom";
        break;
      case " .":
        align.alignH = "right";
        align.alignV = "bottom";
        break;
      default:
        align.alignH = "none";
        align.alignV = "none";
    }
    return align;
  }
}

export { GridTableRule };