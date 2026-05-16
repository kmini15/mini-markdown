import { LinkReferenceRule } from "./block.js";

const name = "link-reference";

export default {
  name: name,
  blocks: [{
    rule: new LinkReferenceRule(name),
    priority: { major: 9000, minor: 5000 },
  }],
};