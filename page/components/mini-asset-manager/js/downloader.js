import JSZip from "https://cdn.jsdelivr.net/npm/jszip/+esm";
import StyleSnapshotter from "./style-snapshotter.js";

class Downloader {
  constructor() {
    this.styleSnapshotter = new StyleSnapshotter();
  }

  async downloadZip(markdownText, htmlText, uploadedFiles, path, zipName = "markdown-post.zip") {
    const zip = new JSZip();
    // 이미지 파일 추가
    for (const item of uploadedFiles) {
      const variants = item.variants;
      for (const [variant, assets] of Object.entries(variants)) {
        const filePath = `${path}/${assets.filename}`;
        zip.file(filePath, assets.blob);
      }
    }
    // markdown 파일 추가
    if (markdownText && markdownText.trim() !== "") {
      zip.file("index.md", markdownText);
    }
    // HTML 파일 추가
    if (htmlText && htmlText.trim() !== "") {
      // CSS 파일 추가 (스타일 시트 스냅샷)
      const styles = await this.styleSnapshotter.snapshot();
      const path = "assets/css";
      styles.forEach((style, index) => {
        if (style.cssText) {
          zip.file(`${path}/${index}-${style.filename}`, style.cssText);
        }
      });
      // HTML 파일 생성
      const previewDoc = document.implementation.createHTMLDocument("Preview");
      const previewUrl = new URL("../html/preview.html", import.meta.url);
      const response = await fetch(previewUrl);
      const previewHtml = await response.text();
      previewDoc.documentElement.innerHTML = previewHtml;
      const div = previewDoc.getElementById("preview");
      if (div) {
        div.innerHTML = htmlText;
      }
      // CSS 링크 추가
      const head = previewDoc.head;
      styles.forEach((style, index) => {
        const link = previewDoc.createElement("link");
        link.rel = "stylesheet";
        link.href = `assets/css/${index}-${style.filename}`;
        head.appendChild(link);
      });
      zip.file("preview.html", previewDoc.documentElement.outerHTML);
    }
    // ZIP 파일 생성
    const zipBlob = await zip.generateAsync({
      type: "blob"
    });
    // ZIP 파일 다운로드
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipName;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default Downloader;