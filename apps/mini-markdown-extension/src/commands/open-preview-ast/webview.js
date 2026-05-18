import MiniMarkdown from "@kmini15/mini-markdown";
import hljs from "highlight.js"
import "./webview.css";

const vscode = acquireVsCodeApi();

const mmd = new MiniMarkdown();
const mmdRoot = document.getElementById("preview");
mmd.mount(mmdRoot);
const mmdAstRoot = document.getElementById("preview-ast");

window.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "update":
      mmd.render(event.data.markdownText);
      mmdAstRoot.innerHTML = mmd.getPreviewAst();
      break;
  }
});

vscode.postMessage({
  type: "ready"
});