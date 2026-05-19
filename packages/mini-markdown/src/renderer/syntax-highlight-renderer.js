export class SyntaxHighlightRenderer {
  constructor() {
    this.text = "";
    this.lines = [];
  }

  render(root, text) {
    this.text = this.normalizeText(text);
    this.lines = this.text.split(/(?<=\n)/);
    const segments = this.buildTokenSegments(root);
    const resolvedSegments = this.resolveOverlaps(segments);
    return this.renderSegments(resolvedSegments);
  }

  normalizeText(text) {
    return String(text ?? "").replace(/\r\n?/g, "\n");
  }

  buildTokenSegments(root) {
    const segments = [];
    const stack = [[root, 0]];
    while (stack.length > 0) {
      const [node, depth] = stack.pop();
      for (const token of node.data.tokens ?? []) {
        if (!token.start || !token.end) continue;
        const start = this.toOffset(token.start);
        const end = this.toOffset(token.end);
        if (start >= end) continue;
        segments.push({
          node,
          token,
          depth,
          start,
          end,
          startPosition: token.start,
          endPosition: token.end,
        });
      }
      for (let child = node.lastChild; child !== null; child = child.prev) {
        stack.push([child, depth + 1]);
      }
    }
    return segments;
  }

  resolveOverlaps(segments) {
    const boundaries = this.getBoundaries(segments);
    const resolved = [];
    for (let i = 0; i < boundaries.length - 1; i++) {
      const start = boundaries[i];
      const end = boundaries[i + 1];
      if (start >= end) continue;
      const covers = segments.filter(segment =>
        segment.start <= start &&
        segment.end >= end
      );
      if (covers.length === 0) continue;
      const selected = this.selectSegment(covers);
      resolved.push({
        node: selected.node,
        token: selected.token,
        depth: selected.depth,
        start,
        end,
      });
    }
    return resolved;
  }

  getBoundaries(segments) {
    const boundaries = new Set();
    for (const segment of segments) {
      boundaries.add(segment.start);
      boundaries.add(segment.end);
    }
    return [...boundaries].sort((a, b) => a - b);
  }

  selectSegment(segments) {
    return segments.reduce((best, segment) => {
      if (!best) return segment;
      if (segment.depth > best.depth) return segment;
      if (segment.depth < best.depth) return best;
      const segmentLength = segment.end - segment.start;
      const bestLength = best.end - best.start;
      if (segmentLength < bestLength) return segment;
      if (segmentLength > bestLength) return best;
      if (segment.start > best.start) return segment;
      return best;
    }, null);
  }

  renderSegments(segments) {
    let html = `<div class="mini-markdown">`;
    let cursor = 0;
    for (const segment of segments) {
      if (segment.start > cursor) {
        html += this.renderPlain(this.text.slice(cursor, segment.start));
      }
      html += this.renderToken(
        segment,
        this.text.slice(segment.start, segment.end)
      );
      cursor = segment.end;
    }
    if (cursor < this.text.length) {
      html += this.renderPlain(this.text.slice(cursor));
    }
    html += `</div>`;
    return html;
  }

  renderPlain(text) {
    return this.escapeHtml(text);
  }

  renderToken(segment, text) {
    const nodeType = this.escapeClass(segment.node.type);
    const tokenType = this.escapeClass(segment.token.type);
    return `<span class="${nodeType} token-${tokenType}">${this.escapeHtml(text)}</span>`;
  }

  toOffset(position) {
    let offset = 0;
    for (let row = 0; row < position.row; row++) {
      offset += this.lines[row].length;
    }
    return offset + position.idx;
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  escapeClass(value) {
    return String(value ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "-");
  }
}
