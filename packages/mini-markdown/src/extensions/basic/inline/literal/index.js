import { LiteralRenderer } from "./renderer.js";

const name = "literal";

export const Literal = {
  name: name,
  renderers: [new LiteralRenderer(name)],
};