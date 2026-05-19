import * as vscode from "vscode";

import { VSCodeTokenHighlighter } from "./vscode-token-highlighter.js";

import { openPreview } from "./commands/open-preview/index.js";
import { openPreviewAst } from "./commands/open-preview-ast/index.js";
import { openPreviewHtml } from "./commands/open-preview-html/index.js";
import { openPreviewToken } from "./commands/open-preview-token/index.js";

export function activate(context) {
  const highlighter = new VSCodeTokenHighlighter();
  highlighter.activate();
  context.subscriptions.push(highlighter);

  const commands = {
    "miniMarkdownExtension.openPreview": openPreview,
    "miniMarkdownExtension.openPreviewAst": openPreviewAst,
    "miniMarkdownExtension.openPreviewHtml": openPreviewHtml,
    "miniMarkdownExtension.openPreviewToken": openPreviewToken,
  }

  for (const [command, func] of Object.entries(commands)) {
    context.subscriptions.push(vscode.commands.registerCommand(
      command, () => {
        func(context);
      }
    ));
  }
}

export function deactivate() { }