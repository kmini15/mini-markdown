import { Block } from "../../../../core/block.js";
import { Node } from "../../../../core/node.js";

class TableRule extends Block {
  constructor(type) {
    super(type);
    this.patternData = /^\s*([:-])[-]+([:-])\s*$/;
  }

  parse(context, parent) {
    const capture = context.input.capture();
    const headLine = context.input.current()?.trim();
    context.input.advance();
    const markLine = context.input.current()?.trim();
    if (!headLine || !markLine) {
      context.input.restore(capture);
      return null;
    }
    const headCells = headLine
      .replace(/^\||\|$/g, "")
      .split("|").map(cell => cell.trim());
    const markCells = markLine
      .replace(/^\||\|$/g, "")
      .split("|").map(cell => cell.trim());
    if (headCells.length < 2) {
      context.input.restore(capture);
      return null;
    }
    if (headCells.length !== markCells.length) {
      context.input.restore(capture);
      return null;
    }
    const aligns = markCells.map((cell) => {
      const match = this.patternData.exec(cell);
      if (!match) {
        return null;
      }
      let align = "left";
      if (match[1] === ":" && match[2] === ":") {
        align = "center";
      } else if (match[1] === "-" && match[2] === ":") {
        align = "right";
      }
      return align;
    });
    if (aligns.some(align => align === null)) {
      context.input.restore(capture);
      return null;
    }
    const tableNode = new Node(this.type);
    tableNode.data.token = {
      text: "",
      start: { row: 0, col: 0, idx: 0 },
      end: { row: 0, col: 0, idx: 0 },
    }
    const tableRowNode = new Node(this.type + "-row");
    tableRowNode.data.token = {
      text: "",
      start: { row: 0, col: 0, idx: 0 },
      end: { row: 0, col: 0, idx: 0 },
    }
    headCells.forEach((cell, index) => {
      const textNode = new Node("text");
      textNode.data.token = {
        text: cell,
        start: { row: 0, col: 0, idx: 0 },
        end: { row: 0, col: 0, idx: 0 },
      }
      const tableCellNode = new Node(this.type + "-cell");
      tableCellNode.data.token = {
        text: "",
        start: { row: 0, col: 0, idx: 0 },
        end: { row: 0, col: 0, idx: 0 },
      };
      tableCellNode.data.fields = {
        align: aligns[index],
        isHeader: true,
      };
      tableCellNode.appendChild(textNode);
      tableRowNode.appendChild(tableCellNode);
    });
    tableNode.appendChild(tableRowNode);

    while (!context.input.eof()) {
      const capture = context.input.capture();
      context.input.advance();
      const cellLine = context.input.current()?.trim();
      const dataCells = cellLine
        .replace(/^\||\|$/g, "")
        .split("|").map(cell => cell.trim());
      if (dataCells.length !== headCells.length) {
        context.input.restore(capture);
        break;
      }
      const tableRowNode = new Node(this.type + "-row");
      tableRowNode.data.token = {
        text: "",
        start: { row: 0, col: 0, idx: 0 },
        end: { row: 0, col: 0, idx: 0 },
      }
      dataCells.forEach((cell, index) => {
        const textNode = new Node("text");
        textNode.data.token = {
          text: cell,
          start: { row: 0, col: 0, idx: 0 },
          end: { row: 0, col: 0, idx: 0 },
        }
        const tableCellNode = new Node(this.type + "-cell");
        tableCellNode.data.token = {
          text: "",
          start: { row: 0, col: 0, idx: 0 },
          end: { row: 0, col: 0, idx: 0 },
        };
        tableCellNode.data.fields = {
          align: aligns[index],
          isHeader: false,
        };
        tableCellNode.appendChild(textNode);
        tableRowNode.appendChild(tableCellNode);
      });
      tableNode.appendChild(tableRowNode);
    }
    context.input.consume(context.input.current().length);
    return tableNode;
  }

}

export { TableRule };