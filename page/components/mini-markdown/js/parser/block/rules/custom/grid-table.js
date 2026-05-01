import { Node, BlockRule, TextWidth } from "../block-rule.js";

class GridTableRule extends BlockRule {
  constructor() {
    super("GRID_TABLE");
    this.patternDiv = /^(\s*)[|][\s\S]+[|]/;
    this.patternRow0 = /^(\s*)[|+][:'.]?[\s]+[:'.]?[|+]/;
    this.patternRow1 = /^(\s*)[|+][:'.]?[\-]+[:'.]?[|+]/;
    this.patternRow2 = /^(\s*)[|+][:'.]?[\=]+[:'.]?[|+]/;
    this.patternRow3 = /^(\s*)[|+][:'.]?[\s\S]+[:'.]?[|+]/;
    this.textWidth = new TextWidth();
  }

  parseColumns(rowLine) {
    const normalizedLine = rowLine.trim()
      .replace(/^[|+]/, "")
      .replace(/[|+]$/, "");
    const cells = normalizedLine.split(/[|+]/);
    const columns = [];
    let index = 0;
    for (const cell of cells) {
      index += this.textWidth.measure(cell) + 1;
      columns.push(index);
    }
    return columns;
  }

  parseColSpans(divLine, columns) {
    const normalizedLine = divLine.trim();
    const colSpans = [];
    for (const column of columns) {
      const index = this.textWidth.indexAtColumn(normalizedLine, column);
      if (/[|+]/.test(normalizedLine[index])) {
        colSpans.push(1); // line
      } else {
        colSpans.push(0); // no line
      }
    }
    return colSpans;
  }

  parseRowSpans(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const rowSpans = [];
    let currIndex = 1;
    for (const column of columns) {
      const index = this.textWidth.indexAtColumn(normalizedLine, column);
      const chunk = normalizedLine.slice(currIndex, index);
      if (/\s+/.test(chunk)) {
        rowSpans.push(0); // no line
      } else {
        rowSpans.push(1);
      }
      currIndex = index + 1;
    }
    return rowSpans;
  }

  parseCells(divLine, columns, colSpans) {
    const normalizedLine = divLine.trim();
    const cells = [];
    let begin = 0;
    let count = 0;
    for (let i = 0; i < columns.length; i++) {
      if (colSpans[i] === 1) {
        const index = this.textWidth.indexAtColumn(normalizedLine, columns[i]);
        const content = normalizedLine.slice(begin + 1, index).trim();
        cells.push(content);
        cells.push(...Array(count).fill(""));
        begin = index;
        count = 0;
      } else {
        count++;
      }
    }
    return cells;
  }

  parseHorizontalAlignments(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const alignments = [];
    let currIndex = 0;
    for (const column of columns) {
      const index = this.textWidth.indexAtColumn(normalizedLine, column);
      let markL = normalizedLine[currIndex + 1];
      let markR = normalizedLine[index - 1];
      if (/[:'.]/.test(markL) && /[:'.]/.test(markR) && markL !== markR) {
        alignments.push("");
        currIndex = index + 1;
        continue;
      }
      if (/[:'.]/.test(markL)) markL = ":";
      if (/[:'.]/.test(markR)) markR = ":";
      let alignH;
      if (markL === ":" && markR === ":") {
        alignH = "center";
      } else if (markL === ":") {
        alignH = "left";
      } else if (markR === ":") {
        alignH = "right";
      } else {
        alignH = "";
      }
      alignments.push(alignH);
      currIndex = index;
    }
    return alignments;
  }

  parseVerticalAlignments(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const alignments = [];
    let currIndex = 0;
    for (const column of columns) {
      const index = this.textWidth.indexAtColumn(normalizedLine, column);
      let markL = normalizedLine[currIndex + 1];
      let markR = normalizedLine[index - 1];
      if (/[:'.]/.test(markL) && /[:'.]/.test(markR) && markL !== markR) {
        alignments.push("");
        currIndex = index + 1;
        continue;
      }
      let alignV;
      if (markL === ":") {
        alignV = "center";
      } else if (markL === "'") {
        alignV = "start";
      } else if (markL === ".") {
        alignV = "end";
      } else if (markR === ":") {
        alignV = "center";
      } else if (markR === "'") {
        alignV = "start";
      } else if (markR === ".") {
        alignV = "end";
      } else {
        alignV = "";
      }
      alignments.push(alignV);
      currIndex = index;
    }
    return alignments;
  }

  parseHeaders(rowLine, columns) {
    const normalizedLine = rowLine.trim();
    const headers = [];
    let currIndex = 0;
    for (const column of columns) {
      const index = this.textWidth.indexAtColumn(normalizedLine, column);
      const chunk = normalizedLine.slice(currIndex, index + 1);
      if (chunk.includes("=")) {
        headers.push(true);
      } else {
        headers.push(false);
      }
      currIndex = index + 1;
    }
    return headers;
  }

  start(parent, reader, context) {
    reader.capture();
    const openLine = context.remains();
    const openMatch = openLine.match(this.patternRow1);
    reader.advance();
    if (!openMatch) {
      reader.restore();
      return null;
    }
    const divLine = reader.current();
    const divMatch = divLine?.match(this.patternDiv);
    reader.advance();
    if (!divMatch) {
      reader.restore();
      return null;
    }
    const rowLine = reader.current();
    const rowMatch = rowLine?.match(this.patternRow3);
    reader.advance();
    if (!rowMatch) {
      reader.restore();
      return null;
    }
    // Matched a table header and delimiter
    const columns = this.parseColumns(openLine);
    const colSpans = this.parseColSpans(divLine, columns);
    const rowSpans = this.parseRowSpans(rowLine, columns);
    const divCells = this.parseCells(divLine, columns, colSpans);
    const rowCells = this.parseCells(rowLine, columns, colSpans);
    const alignH = this.parseHorizontalAlignments(rowLine, columns);
    const alignV = this.parseVerticalAlignments(rowLine, columns);
    const headers = this.parseHeaders(rowLine, columns);
    const tableColSpans = [colSpans];
    const tableRowSpans = [rowSpans];
    const tableDivCells = [divCells];
    const tableRowCells = [rowCells];
    const tableAlignH = [alignH];
    const tableAlignV = [alignV];
    const tableHeaders = [headers];
    while (!reader.eof()) {
      reader.capture();
      const divLine = reader.current();
      const divLineMatch = divLine?.match(this.patternDiv);
      reader.advance();
      const rowLine = reader.current();
      const rowLineMatch = rowLine?.match(this.patternRow3);
      reader.advance();
      if (!divLineMatch || !rowLineMatch) {
        reader.restore();
        break;
      }
      const colSpans = this.parseColSpans(divLine, columns);
      const rowSpans = this.parseRowSpans(rowLine, columns);
      const divCells = this.parseCells(divLine, columns, colSpans);
      const rowCells = this.parseCells(rowLine, columns, colSpans);
      const alignH = this.parseHorizontalAlignments(rowLine, columns);
      const alignV = this.parseVerticalAlignments(rowLine, columns);
      const headers = this.parseHeaders(rowLine, columns);
      tableColSpans.push(colSpans);
      tableRowSpans.push(rowSpans);
      tableDivCells.push(divCells);
      tableRowCells.push(rowCells);
      tableAlignH.push(alignH);
      tableAlignV.push(alignV);
      tableHeaders.push(headers);
    }
    // Sweep cols to calculate col spans
    for (let row = 0; row < tableColSpans.length; row++) {
      let index = 0;
      for (let col = 0; col < colSpans.length; col++) {
        if (tableColSpans[row][col] === 0) continue;
        tableColSpans[row][col] = 0;
        tableColSpans[row][index] = col - index + 1;
        if (tableColSpans[row][index] > 1) {
          const alignHL = tableAlignH[row][index];
          const alignHR = tableAlignH[row][col];
          const alignVL = tableAlignV[row][index];
          const alignVR = tableAlignV[row][col];
          if (alignHL === "left" && alignHR === "right") {
            if (alignVL === alignVR) {
              tableAlignH[row][index] = "center";
              tableAlignV[row][index] = alignVL;
            } else {
              tableAlignH[row][index] = "";
              tableAlignV[row][index] = "";
            }
          } else if (alignHL === "left" && alignHR === "") {
            tableAlignH[row][index] = "left";
            tableAlignV[row][index] = alignVL;
          } else if (alignHL === "" && alignHR === "right") {
            tableAlignH[row][index] = "right";
            tableAlignV[row][index] = alignVR;
          } else {
            tableAlignH[row][index] = "";
            tableAlignV[row][index] = "";
          }
        }
        let header = tableHeaders[row][index];
        for (let i = index + 1; i <= col; i++) {
          header = header || tableHeaders[row][i];
        }
        tableHeaders[row][index] = header;
        index = col + 1;
      }
    }
    // Sweep rows to calculate row spans & merge cells
    for (let col = 0; col < columns.length; col++) {
      let index = 0;
      for (let row = 0; row < tableRowSpans.length; row++) {
        if (tableRowSpans[row][col] === 0) continue;
        tableRowSpans[row][col] = 0;
        tableRowSpans[index][col] = row - index + 1;
        for (let i = index + 1; i <= row; i++) {
          tableDivCells[index][col] += "\n" + tableRowCells[i - 1][col];
          tableRowCells[i - 1][col] = "";
          tableDivCells[index][col] += "\n" + tableDivCells[i][col];
          tableDivCells[i][col] = "";
        }
        // Carry alignments and headers from the bottom cell to the merged cell
        tableAlignH[index][col] = tableAlignH[row][col];
        tableAlignV[index][col] = tableAlignV[row][col];
        tableHeaders[index][col] = tableHeaders[row][col];
        index = row + 1;
      }
    }
    const tableNode = new Node("GRID_TABLE");
    tableNode.fields = {
      columns: columns.length,
    };
    for (let row = 0; row < tableRowSpans.length; row++) {
      const rowNode = new Node("GRID_TABLE_ROW");
      for (let col = 0; col < columns.length; col++) {
        const divCell = tableDivCells[row][col];
        const rowCell = tableRowCells[row][col];
        const colSpan = tableColSpans[row][col];
        const rowSpan = tableRowSpans[row][col];
        const alignH = tableAlignH[row][col];
        const alignV = tableAlignV[row][col];
        const header = tableHeaders[row][col];
        if (colSpan === 0 || rowSpan === 0) continue;
        const cellType = (header) ? "GRID_TABLE_HEADER" : "GRID_TABLE_DATA";
        const alignTextH = alignH;
        const alignTextV = alignV;
        let alignItemH;
        let alignItemV;
        switch (alignH) {
          case "left":
            alignItemH = "start";
            break;
          case "center":
            alignItemH = "center";
            break;
          case "right":
            alignItemH = "end";
            break;
          default:
            alignItemH = "";
        }
        switch (alignV) {
          case "top":
            alignItemV = "start";
            break;
          case "middle":
            alignItemV = "center";
            break;
          case "bottom":
            alignItemV = "end";
            break;
          default:
            alignItemV = "";
        }
        const cellNode = new Node(cellType);
        cellNode.fields = {
          row: row + 1,
          col: col + 1,
          rowSpan: rowSpan,
          colSpan: colSpan,
          alignTextH: alignTextH,
          alignTextV: alignTextV,
          alignItemH: alignItemH,
          alignItemV: alignItemV,
        };
        const textNode = new Node("TEXT");
        textNode.value = divCell;
        textNode.fields = {
          inline: true,
        };
        cellNode.appendChild(textNode);
        rowNode.appendChild(cellNode);
      }
      tableNode.appendChild(rowNode);
    }
    context.advance(openLine.length);
    reader.retreat();
    return tableNode;
  }
}

export { GridTableRule };