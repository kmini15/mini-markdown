import Behavior from "../behavior.js";

class TemplateBehavior extends Behavior {
  constructor(type) {
    super(type);
  }
  
  mount(root) {
    return;
  }
  
  unmount(root) {
    return;
  }
}

export { TemplateBehavior };