import HighlighterLanguageCpp from "./languages/cpp.js";

class MiniHighlighter {
  constructor() {
    this.highlighterList = {
      cpp: new HighlighterLanguageCpp(),
    };
    this.rootElement = null;
  }

  async mount(rootElement) {
    this.rootElement = rootElement;
    try {
      await this.loadCSS();
    } catch (error) {
      console.error("Failed to load highlighter CSS:", error);
    }
  }

  highlight() {
    if (!this.rootElement) return;
    this.rootElement.querySelectorAll("pre code").forEach((block) => {
      const language = this.detectLanguage(block.classList);
      if (!language) return;
      this.highlightCodeBlock(block, language);
    });
  }

  highlightCodeBlock(block, language) {
    const highlighter = this.highlighterList[language];
    if (highlighter) {
      const text = block.innerText;
      block.innerHTML = highlighter.highlight(text);
    }
  }

  detectLanguage(classList) {
    const match = Array.from(classList).find(cls => cls.startsWith("language-"));
    if (!match) return null;
    return match.replace("language-", "");
  }

  async loadCSS() {
    const href = new URL("../css/style.css", import.meta.url).href;
    const existing = document.querySelector(`link[data-mini-highlighter-css="${href}"]`);
    if (existing) return;
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.miniHighlighterCss = href;
      link.onload = () => resolve();
      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${href}`));
      };
      document.head.appendChild(link);
    });
  }
}

export default MiniHighlighter;