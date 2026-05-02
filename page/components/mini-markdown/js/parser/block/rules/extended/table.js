import { Node, BlockRule } from "../block-rule.js";

class TableRule extends BlockRule {
  constructor() {
    super("TABLE");
    this.pattern_row = /^[\s\S]+\|[\s\S]+$/;
    this.pattern_delimiter = /^\|?[-:]+\|[-:]+/;
  }

  start(parent, reader, context) {
    const headerLine = context.remains();
    const matchHeader = headerLine?.match(this.pattern_row);
    if (!matchHeader) return null;
    reader.advance();
    const delimiterLine = reader.current();
    const matchDelimiter = delimiterLine?.match(this.pattern_delimiter);
    reader.retreat();
    if (!delimiterLine || !matchDelimiter) return null;
    const numHeaderColumns = this.getNumColumns(headerLine);
    const numDelimiterColumns = this.getNumColumns(delimiterLine);
    if (numHeaderColumns !== numDelimiterColumns) return null;
    reader.advance();
    reader.advance();
    // Matched a table header and delimiter
    const tableNode = new Node(this.type);
    const alignments = this.getCellAlignments(delimiterLine);
    const headerRowNode = this.buildTableHeaderRowNode(headerLine, alignments);
    tableNode.appendChild(headerRowNode);
    while (!reader.eof()) {
      const line = reader.current();
      if (!line.match(this.pattern_row)) break;
      if (this.getNumColumns(line) !== numHeaderColumns) break;
      const rowNode = this.buildTableRowNode(line, alignments);
      tableNode.appendChild(rowNode);
      reader.advance();
    }
    context.advance(headerLine.length);
    reader.retreat();
    return tableNode;
  }

  getNumColumns(line) {
    const normalizedLine = line.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|");
    return cells.length;
  }

  getCellContents(line) {
    const normalizedLine = line.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|")
      .map(cell => cell.trim());
    return cells;
  }

  getCellAlignments(delimiterLine) {
    const normalizedLine = delimiterLine.trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "");
    const cells = normalizedLine.split("|")
      .map(cell => cell.trim());
    const alignments = cells.map(cell => {
      if (cell.startsWith(":") && cell.endsWith(":")) {
        return "center";
      } else if (cell.startsWith(":")) {
        return "left";
      } else if (cell.endsWith(":")) {
        return "right";
      } else {
        return "left";
      }
    });
    return alignments;
  }

  buildTableHeaderRowNode(headerLine, alignments) {
    const headerCells = this.getCellContents(headerLine);
    const headerRowNode = new Node("TABLE_ROW");
    for (let i = 0; i < headerCells.length; i++) {
      const cell = headerCells[i];
      const alignment = alignments[i];
      const headerCellNode = new Node("TABLE_HEADER");
      headerCellNode.fields = {
        alignTextH: alignment,
        alignItemH: alignment,
      };
      const textNode = new Node("TEXT");
      textNode.value = cell;
      textNode.fields = {
        inline: true,
      };
      headerCellNode.appendChild(textNode);
      headerRowNode.appendChild(headerCellNode);
    }
    return headerRowNode;
  }

  buildTableRowNode(line, alignments) {
    const cells = this.getCellContents(line);
    const rowNode = new Node("TABLE_ROW");
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const alignment = alignments[i];
      const cellNode = new Node("TABLE_DATA");
      cellNode.fields = {
        alignTextH: alignment,
        alignItemH: alignment,
      };
      const textNode = new Node("TEXT");
      textNode.value = cell;
      textNode.fields = {
        inline: true,
      };
      cellNode.appendChild(textNode);
      rowNode.appendChild(cellNode);
    }
    return rowNode;
  }
}

export { TableRule };