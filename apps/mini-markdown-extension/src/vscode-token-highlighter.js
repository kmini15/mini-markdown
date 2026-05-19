import * as vscode from "vscode";
import MiniMarkdown from "@kmini15/mini-markdown";

export class VSCodeTokenHighlighter {
  constructor() {
    this.parser = new MiniMarkdown();
    this.decorationTypes = new Map();
    this.disposables = [];
  }

  activate() {
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(editor => {
        this.update(editor);
      })
    );
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        if (event.document !== editor.document) return;
        this.update(editor);
      })
    );
    this.update(vscode.window.activeTextEditor);
  }

  update(editor = vscode.window.activeTextEditor) {
    try {
      if (!this.shouldHighlight(editor)) {
        this.clear(editor);
        return;
      }
      const text = editor.document.getText();
      const root = this.parser.parse(text);
      if (!root) {
        this.clear(editor);
        return;
      }
      const segments = this.parser.tokenSegmentBuilder.build(root);
      const groups = this.groupSegments(editor.document, segments);
      this.applyGroups(editor, groups);
      this.clearUnusedDecorations(editor, groups);
    } catch (error) {
      console.error("[mini-markdown] update highlight failed", error);
    }
  }

  shouldHighlight(editor) {
    if (!editor) return false;

    const document = editor.document;

    if (document.languageId !== "markdown") return false;
    if (!["file", "vscode-remote"].includes(document.uri.scheme)) return false;
    if (!vscode.workspace.getWorkspaceFolder(document.uri)) return false;

    return true;
  }

  groupSegments(document, segments) {
    const groups = new Map();

    for (const segment of segments) {
      if (!Number.isInteger(segment.start)) continue;
      if (!Number.isInteger(segment.end)) continue;
      if (segment.start >= segment.end) continue;

      const key = this.getDecorationKey(segment);
      const range = this.toRange(document, segment);

      if (range.isEmpty) continue;

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key).push(range);
    }

    return groups;
  }

  applyGroups(editor, groups) {
    for (const [key, ranges] of groups) {
      const decorationType = this.getDecorationType(key);
      editor.setDecorations(decorationType, ranges);
    }
  }

  toRange(document, segment) {
    const max = document.getText().length;

    const start = Math.max(0, Math.min(segment.start, max));
    const end = Math.max(0, Math.min(segment.end, max));

    return new vscode.Range(
      document.positionAt(start),
      document.positionAt(end)
    );
  }

  getDecorationKey(segment) {
    return `${segment.nodeType}.${segment.tokenType}`;
  }

  getDecorationType(key) {
    if (this.decorationTypes.has(key)) {
      return this.decorationTypes.get(key);
    }

    const decorationType = vscode.window.createTextEditorDecorationType(
      this.getStyle(key)
    );

    this.decorationTypes.set(key, decorationType);
    return decorationType;
  }

  getStyle(key) {
    if (key.endsWith(".content")) {
      return {
        color: "rgb(120, 150, 240)",
      };
    }

    if (key.endsWith(".marker")) {
      return {
        color: "rgb(120, 180, 240)",
      };
    }

    if (key.endsWith(".param")) {
      return {
        color: "rgb(240, 180, 180)",
      };
    }
    
    if (key.endsWith(".code")) {
      return {
        color: "rgb(240, 150, 180)",
      };
    }

    return {};
  }

  clear(editor = vscode.window.activeTextEditor) {
    if (!editor) return;

    for (const decorationType of this.decorationTypes.values()) {
      editor.setDecorations(decorationType, []);
    }
  }

  clearUnusedDecorations(editor, activeGroups) {
    for (const [key, decorationType] of this.decorationTypes) {
      if (!activeGroups.has(key)) {
        editor.setDecorations(decorationType, []);
      }
    }
  }

  dispose() {
    this.clear();

    for (const disposable of this.disposables) {
      disposable.dispose();
    }

    for (const decorationType of this.decorationTypes.values()) {
      decorationType.dispose();
    }

    this.disposables = [];
    this.decorationTypes.clear();
  }
}