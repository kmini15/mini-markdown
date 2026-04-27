import HighlighterLanguageCpp from "./highlighter/language-cpp.js";

class Highlighter {
  constructor() {
    this.highlighterList = {
      cpp: new HighlighterLanguageCpp(),
    };
  }

  highlight() {
    document.querySelectorAll("pre code").forEach((block) => {
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
}

export default Highlighter;