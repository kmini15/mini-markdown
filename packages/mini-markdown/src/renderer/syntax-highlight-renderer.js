import { TokenSegmentBuilder } from "./token-segment-builder.js";

export class SyntaxHighlightRenderer {
  constructor(segmentBuilder = new TokenSegmentBuilder()) {
    this.segmentBuilder = segmentBuilder;
    this.text = "";
  }

  render(root, text) {
    this.text = String(text ?? "");
    const segments = this.segmentBuilder.build(root);
    return this.renderSegments(segments);
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
    const nodeType = this.escapeClass(segment.nodeType);
    const tokenType = this.escapeClass(segment.tokenType);
    return `<span class="${nodeType} token-${tokenType}">${this.escapeHtml(text)}</span>`;
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