import { TextRenderer } from "./renderer.js";

const name = "text";

export const Text = {
  name: name,
  renderers: [new TextRenderer(name)],
};