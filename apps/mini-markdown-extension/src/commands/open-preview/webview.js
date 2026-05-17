import MiniMarkdown from "@kmini15/mini-markdown";
import hljs from "highlight.js"
import "./webview.css";

const vscode = acquireVsCodeApi();

const mmd = new MiniMarkdown();
const mmdRoot = document.getElementById("preview");
mmd.mount(mmdRoot);

window.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "update":
      mmd.render(event.data.markdownText);
      mmd.style();
      resolveImages(event.data.markdownPath);
      highlightFencedCodeBlocks();
      break;
  }
});

function resolveImages(basePath) {
  mmdRoot.querySelectorAll("img").forEach(img => {
    const src = img.getAttribute("src");
    if (!src) return;
    if (/^(https?|data|vscode-webview):/.test(src)) return;
    img.src = new URL(src, basePath).href;
  });
}

function highlightFencedCodeBlocks() {
  mmdRoot.querySelectorAll("code.fenced-code-block").forEach(block => {
    hljs.highlightElement(block);
  });
}

vscode.postMessage({
  type: "ready"
});