export class InlineParser {
  constructor(rules) {
    this.rules = rules;
  }
  
  parse(node) {
    for (let rule of this.rules) {
      rule.parse(node);
    }
    return node;
  }
}
