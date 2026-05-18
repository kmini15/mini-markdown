export class OrderResolver {
  static resolve(items, options = {}) {
    const resolver = new OrderResolver(items, options);
    return resolver.resolve();
  }

  constructor(items = [], options = {}) {
    this.items = items;
    this.strict = options.strict ?? false;
  }

  resolve() {
    const nodes = this.createNodes();
    const graph = this.createGraph(nodes);
    this.applyConstraints(nodes, graph);
    return this.sort(nodes, graph);
  }

  createNodes() {
    const nodes = new Map();
    for (const item of this.items) {
      if (!item.name) {
        throw new Error("Ordered item must have a name");
      }
      if (nodes.has(item.name)) {
        throw new Error(`Duplicate ordered item name: ${item.name}`);
      }
      nodes.set(item.name, {
        name: item.name,
        item,
        incoming: 0,
      });
    }
    return nodes;
  }

  createGraph(nodes) {
    const graph = new Map();
    for (const name of nodes.keys()) {
      graph.set(name, new Set());
    }
    return graph;
  }

  applyConstraints(nodes, graph) {
    for (const item of this.items) {
      const before = item.order?.before ?? [];
      const after = item.order?.after ?? [];
      for (const target of before) {
        this.addEdge(nodes, graph, item.name, target);
      }
      for (const target of after) {
        this.addEdge(nodes, graph, target, item.name);
      }
    }
  }

  addEdge(nodes, graph, from, to) {
    if (!nodes.has(from) || !nodes.has(to)) {
      if (this.strict) {
        throw new Error(`Unknown order dependency: ${from} -> ${to}`);
      }
      return;
    }
    const edges = graph.get(from);
    if (edges.has(to)) return;
    edges.add(to);
    nodes.get(to).incoming += 1;
  }

  sort(nodes, graph) {
    const queue = [];
    for (const node of nodes.values()) {
      if (node.incoming === 0) {
        queue.push(node);
      }
    }
    const result = [];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.item);
      for (const nextName of graph.get(node.name)) {
        const next = nodes.get(nextName);
        next.incoming -= 1;
        if (next.incoming === 0) {
          queue.push(next);
        }
      }
    }
    if (result.length !== nodes.size) {
      throw new Error(`Circular order dependency: ${this.getCycleHint(nodes)}`);
    }
    return result;
  }

  getCycleHint(nodes) {
    return [...nodes.values()]
      .filter(node => node.incoming > 0)
      .map(node => node.name)
      .join(" -> ");
  }
}
