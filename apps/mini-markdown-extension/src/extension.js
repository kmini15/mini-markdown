import * as vscode from "vscode";

import { openPreview }
  from "./commands/open-preview/index.js";

export function activate(context) {
  const commands = {
    "miniMarkdownExtension.openPreview": openPreview,
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
