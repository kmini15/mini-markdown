import MiniMarkdown from "@kmini15/mini-markdown";

const mmd = new MiniMarkdown();
const mmdRoot = document.getElementById("preview");
mmd.mount(mmdRoot);
mmd.style();
const response = await fetch("./assets/test.md");
const markdown = await response.text();
const editor = document.getElementById("editor");
editor.value = markdown;
render();

document.getElementById("editor").addEventListener("input", () => {
  render();
});

function resizeTextarea() {
  editor.style.height = "auto";
  editor.style.height = `${editor.scrollHeight}px`;
}

function render() {
  const markdown = document.getElementById("editor").value;
  mmd.render(markdown);
  const previewAst = document.getElementById("preview-ast");
  previewAst.innerHTML = mmd.getPreviewAst();
  const previewHtml = document.getElementById("preview-html");
  previewHtml.innerHTML = mmd.getPreviewHtml();
  const previewTokens = document.getElementById("preview-token");
  previewTokens.innerHTML = mmd.getPreviewToken();
  resizeTextarea();
}