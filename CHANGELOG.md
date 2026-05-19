## CHANGELOG
- **v0.1.1**:
  - Fixed a bug related to fenced code blocks.
  - Added syntax highlighting for fenced code blocks.
  - Improved the extension to automatically update the HTML preview when the active editor changes.
  
- **v0.1.2**:
  - Updated the dependency on `@kmini15/mini-markdown` to version `0.1.2` to include the latest features and bug fixes from the Mini Markdown library.
  
- **v0.1.3**:
  - Fixed a bug related to fenced code blocks.
  - Font size of the preview panel is now the same as the editor font size.
  
- **v0.1.4**:
  - **[Breaking Change]**
    - Refactored the `Node` data structure:
      - `node.data.type` -> `node.type`
      - `node.data.lazy` -> `node.lazy`
      - `node.data.token` -> `node.content`
      - `node.data` now only contains `fields` and `tokens`.
  - Added `TokenRenderer` to render the token tree as HTML.
  - Added syntax highlighting for fenced code blocks on the test page using highlight.js.
  - Added AST Preview, Token Preview, and HTML Preview commands to the VS Code extension.
    - `Mini Markdown Extension: Open Preview (Abstract Syntax Tree)`
    - `Mini Markdown Extension: Open Preview (Token)`
    - `Mini Markdown Extension: Open Preview (HTML)`

- **v0.1.5**:
  - Fixed the code-inline bug and adjusted text and literal handling in the extension layer.
  - Changed the parser pipeline to use a topological sort based approach.
  - Updated `TextContext` so line data includes newline characters.
  - Added cursor offset support.
  - Changed token data so it no longer stores text directly.
  - Added a syntax highlight renderer and VS Code highlight support.
  - Fixed the CSS.

