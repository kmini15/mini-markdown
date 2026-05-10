import Rule from "../../../rule.js";
import Node from "../../../../core/node.js";
import TextWidth from "../../../../core/text-width.js";

class TableRule extends Rule {
  constructor(type) {
    super(type);
    this.patternData = /^\s*([:-])[-]+([:-])\s*$/;
    this.textWidth = new TextWidth();
  }

  start(context, parent) {
    const capture = context.input.capture();
    const tableNode = this.parse(context, parent);
    context.input.restore(capture);
    if (!tableNode) return false;
    return true;
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
    const tableRowNode = new Node(this.type + "-row");
    headCells.forEach((cell, index) => {
      const textNode = new Node("text");
      textNode.value = cell;
      textNode.fields = {
        inline: true,
      }
      const tableCellNode = new Node(this.type + "-cell");
      tableCellNode.fields = {
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
      dataCells.forEach((cell, index) => {
        const textNode = new Node("text");
        textNode.value = cell;
        textNode.fields = {
          inline: true,
        }
        const tableCellNode = new Node(this.type + "-cell");
        tableCellNode.fields = {
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