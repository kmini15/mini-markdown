export class Block {
  constructor(type) {
    this.type = type;
  }
  
  continue(context, node) {
    return false;
  }
  
  start(context, parent) {
    const capture = context.input.capture();
    const child = this.parse(context, parent);
    context.input.restore(capture);
    return child ? true : false;
  }
  
  flush(context, parent) {
    return null;
  }
  
  close(context, node) {
    return true;
  }
  
  parse(context, parent) {
    return null;
  }
}
