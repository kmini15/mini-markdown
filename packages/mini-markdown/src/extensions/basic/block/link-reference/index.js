import { LinkReferenceRule } from "./block.js";

const name = "link-reference";

export const LinkReference = {
  name: name,
  blocks: [{
    name: name,
    order: { after: ["code-block"], before: ["paragraph"] },
    rule: new LinkReferenceRule(name),
  }],
};