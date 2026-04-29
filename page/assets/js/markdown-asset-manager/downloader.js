import JSZip from "https://cdn.jsdelivr.net/npm/jszip/+esm";

class Downloader {
  constructor() {
  }

  async downloadZip(markdownText, htmlText, uploadedFiles, path, zipName = "markdown-post.zip") {
    const htmlDoc = document.implementation.createHTMLDocument("Preview");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./assets/css/markdown.css"
    htmlDoc.head.appendChild(link);
    const div = document.createElement("div");
    div.className = "markdown-body";
    div.innerHTML = htmlText;
    htmlDoc.body.appendChild(div);

    const zip = new JSZip();
    // markdown 파일 추가
    zip.file("index.md", markdownText);
    // HTML 파일 추가
    zip.file("index.html", htmlDoc.documentElement.outerHTML);
    // 이미지 파일 추가
    for (const item of uploadedFiles) {
      const variants = item.variants;
      for (const [variant, assets] of Object.entries(variants)) {
        const filePath = `${path}/${assets.filename}`;
        zip.file(filePath, assets.blob);
      }
    }
    const cssFiles = [
      "assets/css/markdown.css",
      "assets/css/style.css"
    ];
    for (const path of cssFiles) {
      const res = await fetch(path);
      const blob = await res.blob();
      zip.file(path, blob);
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