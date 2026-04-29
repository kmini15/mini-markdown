class StyleSnapshotter {
  constructor(doc = document) {
    this.document = doc;
  }

  async snapshot() {
    const snapshots = [];
    for (const sheet of this.document.styleSheets) {
      const result = await this.snapshotSheet(sheet, snapshots.length);
      snapshots.push(result);
    }
    return snapshots;
  }

  async snapshotSheet(sheet, index) {
    const href = sheet.href;
    const filename = this.createFilename(sheet, index);
    // 1. CSSOM 접근 가능
    try {
      const cssText = this.extractCssRules(sheet);
      return {
        type: "inline",
        href,
        filename,
        cssText,
      };
    } catch (error) {
      console.warn("cssRules access failed:", href, error);
    }
    // 2. fetch fallback
    if (href) {
      try {
        const cssText = await this.fetchStylesheet(href);
        return {
          type: "external",
          href,
          filename,
          cssText,
        };
      } catch (error) {
        console.warn("fetch failed:", href, error);
      }
    }
    // 3. 완전 실패
    return {
      type: "unreadable",
      href,
      filename: null,
      cssText: null,
      error: "Unable to access stylesheet",
    };
  }

  extractCssRules(sheet) {
    return [...sheet.cssRules]
      .map(rule => rule.cssText)
      .join("\n");
  }

  async fetchStylesheet(href) {
    const response = await fetch(href);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${href}`);
    }
    return await response.text();
  }

  createFilename(sheet, index) {
    if (sheet.href) {
      try {
        const url = new URL(sheet.href);
        const name = url.pathname.split("/").pop();
        if (name) return name;
      } catch { }
    }
    return `style-${index + 1}.css`;
  }
}

export default StyleSnapshotter;