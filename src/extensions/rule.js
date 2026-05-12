class Rule {
  constructor(type) {
    this.type = type;
  }
  
  continue(context, node) {
    return false;
  }
  
  start(context, parent) {
    return false;
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

export default Rule;