class HighlighterLanguageCpp {
  constructor() {
    this.language = "cpp";
    this.keywords = new Set([
      // control flow
      "if", "else", "switch", "case", "default",
      "for", "while", "do", "break", "continue",
      "return", "goto",

      // declarations / modifiers
      "auto", "register", "static", "extern",
      "mutable", "const", "volatile",
      "inline", "virtual", "explicit",
      "friend", "typedef", "typename",
      "constexpr", "consteval", "constinit",

      // class / object
      "class", "struct", "union",
      "public", "private", "protected",
      "this", "new", "delete",

      // exceptions
      "try", "catch", "throw", "noexcept",

      // namespaces
      "namespace", "using",

      // templates / compile-time
      "template", "requires",
      "concept", "decltype",

      // misc
      "sizeof", "alignof", "typeid",
      "asm", "operator"
    ]);
    this.types = new Set(["void",
      "bool",

      "char",
      "wchar_t",
      "char8_t",
      "char16_t",
      "char32_t",

      "short",
      "int",
      "long",

      "float",
      "double",

      "signed",
      "unsigned",

      "size_t",
      "ptrdiff_t",

      "std::string",
      "string",
      "std::wstring",
      "wstring",

      "true",
      "false",
      "nullptr",
      "NULL"
    ]);
    this.operators = new Set([
      "+", "-", "*", "/", "%",
      "=", "+=", "-=", "*=", "/=", "%=",

      "==", "!=", "<", ">", "<=", ">=",

      "&&", "||", "!",

      "&", "|", "^", "~",
      "<<", ">>",

      "++", "--",

      "->", ".", "::",

      "?", ":",

      "<<=", ">>=",
      "&=", "|=", "^="
    ]);
    this.punctuations = new Set([
      "(", ")",
      "{", "}",
      "[", "]",

      ",",
      ";"
    ]);
    this.preprocessors = new Set(["#include",
      "#define",
      "#undef",

      "#if",
      "#ifdef",
      "#ifndef",
      "#elif",
      "#else",
      "#endif",

      "#pragma",
      "#error",
      "#line"
    ]);
    this.prefix = "mini-highlighter-";
    this.output = "";
    this.pos = 0;
  }

  highlight(code) {
    this.output = "";
    this.pos = 0;

    while (this.pos < code.length) {
      const rest = code.slice(this.pos);
      if (this.highlightLineComment(rest)) continue;
      if (this.highlightBlockComment(rest)) continue;
      if (this.highlightStringLiteral(rest)) continue;
      if (this.highlightCharLiteral(rest)) continue;
      if (this.highlightInclude(rest)) continue;
      if (this.highlightKeyword(rest)) continue;
      if (this.highlightType(rest)) continue;
      if (this.highlightOperator(rest)) continue;
      if (this.highlightPunctuation(rest)) continue;
      if (this.highlightPreprocessor(rest)) continue;
      if (this.highlightNumber(rest)) continue;
      // fallback: output the current character.
      this.pushToken(null, code[this.pos]);
      this.pos++;
    }
    return this.output;
  }

  escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  pushToken(type, value) {
    if (type) {
      this.output += `<span class="${this.prefix}${type}">${this.escapeHtml(value)}</span>`;
    } else {
      this.output += this.escapeHtml(value);
    }
  };

  highlightLineComment(rest) {
    const m = rest.match(/^\/\/[^\n]*/);
    if (m) {
      this.pushToken("comment", m[0]);
      this.pos += m[0].length;
      return true;
    }
    return false;
  }

  highlightBlockComment(rest) {
    const m = rest.match(/^\/\*[\s\S]*?(?:\*\/|$)/);
    if (m) {
      this.pushToken("comment", m[0]);
      this.pos += m[0].length;
      return true;
    }
    return false;
  }

  highlightStringLiteral(rest) {
    const m = rest.match(/^"(?:\\.|[^"\\])*"?/);
    if (m) {
      this.pushToken("string", m[0]);
      this.pos += m[0].length;
      return true;
    }
    return false;
  }

  highlightCharLiteral(rest) {
    const m = rest.match(/^'(?:\\.|[^'\\])*'?/);
    if (m) {
      this.pushToken("string", m[0]);
      this.pos += m[0].length;
      return true;
    }
    return false;
  }

  highlightNumber(rest) {
    const patthern = /^([a-zA-Z_]?)(0x[0-9a-fA-F]+|\d+(:?\.\d+)?)(?:[uUlLfF]*)?/;
    const m = rest.match(patthern);
    if (m) {
      if (m[1]) {
        this.pushToken(null, m[1]);
        this.pushToken(null, m[2]);
      } else {
        this.pushToken(null, m[1]);
        this.pushToken("number", m[2]);
      }
      this.pos += m[0].length;
      return true;
    }
    return false;
  }

  highlightKeyword(rest) {
    const m = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (m) {
      const word = m[0];
      if (this.keywords.has(word)) {
        this.pushToken("keyword", word);
        this.pos += word.length;
        return true;
      }
    }
    return false;
  }

  highlightType(rest) {
    const m = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (m) {
      const word = m[0];
      if (this.types.has(word)) {
        this.pushToken("type", word);
        this.pos += word.length;
        return true;
      }
    }
    return false;
  }

  highlightOperator(rest) {
    for (const op of this.operators) {
      if (rest.startsWith(op)) {
        this.pushToken("operator", op);
        this.pos += op.length;
        return true;
      }
    }
    return false;
  }

  highlightPunctuation(rest) {
    for (const punc of this.punctuations) {
      if (rest.startsWith(punc)) {
        this.pushToken("punctuation", punc);
        this.pos += punc.length;
        return true;
      }
    }
    return false;
  }

  highlightPreprocessor(rest) {
    const m = rest.match(/^#[A-Za-z_][A-Za-z0-9_]*/);
    if (m) {
      const directive = m[0];
      if (this.preprocessors.has(directive)) {
        this.pushToken("preprocessor", directive);
        this.pos += directive.length;
        return true;
      }
    }
    return false;
  }

  highlightInclude(rest) {
    const m = rest.match(/^#include\s*([<"])([^>"]+)[>"]/);
    if (m) {
      this.pushToken("preprocessor", "#include");
      this.pushToken(null, " ");
      this.pushToken("string", m[1] + m[2] + (m[1] === "<" ? ">" : '"'));
      this.pos += m[0].length;
      return true;
    }
    return false;
  }
}

export default HighlighterLanguageCpp;