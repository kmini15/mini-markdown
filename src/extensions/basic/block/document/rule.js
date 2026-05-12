import Rule from "../../../rule.js";

class DocumentRule extends Rule {
  constructor(type) {
    super(type);
  }

  continue(context, node) {
    return true;
  }
}

export { DocumentRule };