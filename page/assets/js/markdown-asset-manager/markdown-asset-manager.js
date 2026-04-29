import ImageProcessor from "./image-processor.js";
import Downloader from "./downloader.js";

class MarkdownAssetManager {
  constructor() {
    this.imageProcessor = new ImageProcessor();
    this.downloader = new Downloader();
    this.uploadedFiles = [];
    this.rootElement = null;
    this.itemElement = null;
    this.markdownText = "";
    this.htmlText = "";
    this.nextId = 0;
    this.options = {
      path: "./assets/uploads/images",
    };
  }

  setMarkdownText(text) {
    this.markdownText = text;
  }

  setHtmlText(text) {
    this.htmlText = text;
  }

  async mount(rootElement) {
    this.rootElement = rootElement;
    await this.render();
  }

  async render() {
    await this.loadCSS();
    await this.loadTemplate();
    this.bindImageInput();
    this.bindUploadButton();
    this.bindDownloadButton();
    this.bindCopyEvents();
  }

  async loadCSS() {
    const url = new URL("./assets/css/style.css", import.meta.url).href;
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

  async loadTemplate() {
    const url = new URL("./template.html", import.meta.url);
    const res = await fetch(url);
    this.rootElement.innerHTML = await res.text();
    this.itemElement = this.rootElement.querySelector(
      ".markdown-asset-manager .image-item"
    );
    if (this.itemElement) {
      this.itemElement.remove();
    }
  }

  bindImageInput() {
    const imageInput = this.rootElement.querySelector("#imageInput");
    imageInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files);
      await this.handleImageInput(files);
    });
  }

  bindUploadButton() {
    const uploadButton = this.rootElement.querySelector("#uploadButton");
    const imageInput = this.rootElement.querySelector("#imageInput");
    uploadButton.addEventListener("click", () => {
      imageInput.click();
    });
  }

  bindDownloadButton() {
    const downloadButton = this.rootElement.querySelector("#downloadButton");
    downloadButton.addEventListener("click", async () => {
      await this.downloader.downloadZip(
        this.markdownText, this.htmlText, 
        this.uploadedFiles, this.options.path);
    });
  }

  bindCopyEvents() {
    const uploadedFiles = this.rootElement.querySelector("#uploadedFiles");
    uploadedFiles.addEventListener("click", async (e) => {
      const button = e.target.closest("button");
      if (!button) return;
      const imageItem = button.closest(".image-item");
      if (!imageItem) return;
      const imageItemId = Number(imageItem.dataset.id);
      const item = this.uploadedFiles.find(
        file => file.id === imageItemId
      );
      if (!item) return;
      let variantKey = button.dataset.variant;
      const asset = item.variants[variantKey];
      if (!asset) return;
      const basePath = this.options.path ?? "./assets/uploads";
      const filename = asset.filename;
      const markdownPath = `${basePath}/${filename}`;
      const markdownText = `![${item.alt}](${markdownPath})`;
      await navigator.clipboard.writeText(markdownText);
      await this.indicateCopy(button);
    });
  }

  async handleImageInput(files) {
    for (const file of files) {
      try {
        const id = this.nextId++;
        const alt = file.name;
        const variants = await this.imageProcessor.process(file);
        const item = { id, alt, variants };
        this.uploadedFiles.push(item);
        this.appendImageItem(item);
      } catch (error) {
        console.error("image processing failed for file:", file.name, error);
      }
    }
    return this.uploadedFiles;
  }

  appendImageItem(item) {
    const node = this.itemElement.cloneNode(true);
    node.dataset.id = item.id;
    const img = node.querySelector(".image-preview");
    img.src = URL.createObjectURL(item.variants[320].blob);
    img.alt = item.alt;
    img.title = item.name;
    this.rootElement.querySelector("#uploadedFiles").appendChild(node);
  }

  async indicateCopy(button) {
    try {
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  }

  replaceMarkdownImageSrc(container) {
    const basePath = this.options.path ?? "/assets/uploads";

    container.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;

      const normalizedSrc = src;

      for (const file of this.uploadedFiles) {
        for (const [variant, assets] of Object.entries(file.variants)) {
          const expectedPath =
            `${basePath}/${assets.filename}`;

          if (normalizedSrc !== expectedPath) continue;

          if (!assets.previewUrl) {
            assets.previewUrl = URL.createObjectURL(assets.blob);
          }

          img.src = assets.previewUrl;
          return;
        }
      }
    });
  }

  createSafeFileName(file, id, variant) {
    const ext = this.getExtension(file.name, file.type);
    const timestamp = this.getTimestamp();

    return `${timestamp}-${id}-${variant}${ext}`;
  }

  getTimestamp() {
    const d = new Date();

    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${yyyy}${MM}${dd}-${hh}${mm}${ss}`;
  }

  getExtension(filename, mimeType) {
    const match = filename.match(/\.[^.]+$/);
    if (match) return match[0].toLowerCase();

    if (mimeType === "image/png") return ".png";
    if (mimeType === "image/jpeg") return ".jpg";
    if (mimeType === "image/webp") return ".webp";
    if (mimeType === "image/gif") return ".gif";

    return "";
  }

  getAltFromFileName(filename) {
    return filename.replace(/\.[^.]+$/, "");
  }
}

export default MarkdownAssetManager;