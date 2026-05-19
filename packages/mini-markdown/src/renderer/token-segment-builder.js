export class TokenSegmentBuilder {
  build(root) {
    const segments = this.buildTokenSegments(root);
    const resolved = this.resolveOverlaps(segments);
    return this.toPublicSegments(resolved);
  }

  buildTokenSegments(root) {
    const segments = [];
    const stack = [[root, 0]];

    while (stack.length > 0) {
      const [node, depth] = stack.pop();

      for (const token of node.data.tokens ?? []) {
        if (!token.start || !token.end) continue;
        if (!Number.isInteger(token.start.offset)) continue;
        if (!Number.isInteger(token.end.offset)) continue;

        const start = token.start.offset;
        const end = token.end.offset;

        if (start >= end) continue;

        segments.push({
          nodeType: node.type,
          tokenType: token.type,
          depth,
          start,
          end,
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
        nodeType: selected.nodeType,
        tokenType: selected.tokenType,
        depth: selected.depth,
        start,
        end,
      });
    }

    return resolved;
  }

  toPublicSegments(segments) {
    return segments.map(segment => ({
      nodeType: segment.nodeType,
      tokenType: segment.tokenType,
      start: segment.start,
      end: segment.end,
    }));
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
}

