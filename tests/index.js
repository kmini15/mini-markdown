import MiniMarkdown from "@kmini15/mini-markdown";

const mmd = new MiniMarkdown();
const mmdRoot = document.getElementById("preview");
mmd.mount(mmdRoot);
mmd.style();
const response = await fetch("./assets/test.md");
const markdown = await response.text();
const editor = document.getElementById("editor");
editor.innerText = markdown;
render();

document.getElementById("editor").addEventListener("input", () => {
  render();
});

function render() {
  const markdown = document.getElementById("editor").innerText;
  mmd.render(markdown);
  const previewAst = document.getElementById("preview-ast");
  previewAst.innerHTML = mmd.getTextAst();
  const previewHtml = document.getElementById("preview-html");
  previewHtml.innerText = mmd.getTextHtml();
}