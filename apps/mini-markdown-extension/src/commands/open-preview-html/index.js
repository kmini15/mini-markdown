import * as vscode from "vscode";
import htmlTemplate from "./webview.html?raw";

export async function openPreviewHtml(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  let activeDocument = null;
  
  if (editor.document.languageId === "markdown") {
    activeDocument = editor.document;
  }
  
  const panel = vscode.window.createWebviewPanel(
    "miniMarkdownPreviewHtml",
    "Mini Markdown Preview (HTML)",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "dist"),
        ...(vscode.workspace.workspaceFolders ?? []).map(folder => folder.uri),
      ]
    }
  );

  let html = htmlTemplate;

  const styleUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri,
      "dist",
      "open-preview-webview-html.css")
  );

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri,
      "dist",
      "open-preview-webview-html.js")
  );

  html = html.replace(/\$\{styleUri\}/g, styleUri.toString());
  html = html.replace(/\$\{scriptUri\}/g, scriptUri.toString());

  panel.webview.html = html;

  function updatePreview(panel, document) {
    const markdownUri = panel.webview.asWebviewUri(
      vscode.Uri.file(document.uri.fsPath)
    );
    panel.webview.postMessage({
      type: "update",
      markdownText: document.getText(),
      markdownPath: markdownUri.toString()
    });
  }

  let timer;

  panel.webview.onDidReceiveMessage(message => {
    if (!activeDocument) return;
    switch (message.type) {
      case "ready":
        updatePreview(panel, activeDocument);
        break;
    }
  });

  const changeDocumentDisposable =
    vscode.workspace.onDidChangeTextDocument(event => {
      if (!activeDocument) return;
      if (event.document.uri.toString() !== activeDocument.uri.toString()) {
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        updatePreview(panel, activeDocument);
      }, 100);
    });

  const changeActiveEditorDisposable =
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (!editor) return;
      if (editor.document.languageId !== "markdown") return;
      activeDocument = editor.document;
      clearTimeout(timer);
      timer = setTimeout(() => {
        updatePreview(panel, activeDocument);
      }, 100);
    });

  panel.onDidDispose(() => {
    changeDocumentDisposable.dispose();
    changeActiveEditorDisposable.dispose();
  });
}
