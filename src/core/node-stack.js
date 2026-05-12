class NodeStack {
  constructor() {
    this.stack = [];
  }
  
  push(node) {
    this.stack.push(node);
  }
  
  pop() {
    return this.stack.pop();
  }
  
  top() {
    if (this.stack.length === 0) return null;
    return this.stack[this.stack.length - 1];
  }
  
  at(index) {
    if (index < 0 || index >= this.stack.length) return null;
    return this.stack[index];
  }
  
  size() {
    return this.stack.length;
  }
}

export default NodeStack;