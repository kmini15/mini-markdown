import heic2any from "https://cdn.jsdelivr.net/npm/heic2any/+esm";

class ImageProcessor {
  constructor() {
    this.targetFormat = "image/jpg";
    this.targetExtension = "jpg";
  }

  async process(file) {
    const source = file;
    const master = await this.normalizeFormat(source);
    const variants = await this.createVariants(master);
    variants["source"] = ({ 
      blob: source, 
      filename: this.createVariantFilename(source.name, "source")
    });
    return variants;
  }

  async createVariants(file) {
    const targetWidths = [320, 640, 960, 1280];
    const blobVariants = await Promise.all(
      targetWidths.map(width => this.resize(file, width))
    );
    const variants = {};
    blobVariants.forEach((blob, index) => {
      const width = targetWidths[index];
      const filename = this.createVariantFilename(file.name, width);
      variants[width] = { blob, filename };
    });
    return variants;
  }

  async resize(file, targetWidth = 1280) {
    const img = await this.loadImage(file);
    const aspectRatio = img.width / img.height;
    const width = targetWidth;
    const height = Math.round(targetWidth / aspectRatio);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context not available");
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    return this.canvasToBlob(canvas, this.targetFormat, 1.0);
  };

  async normalizeFormat(file) {
    const normalized = await this.normalizeHeic(file);
    if (normalized.type === this.targetFormat) {
      return normalized;
    }
    const blob = await this.resize(normalized);
    const fileName = normalized.name.replace(/\.[^.]+$/, `.${this.targetExtension}`);
    const properties = { type: this.targetFormat };
    return new File([blob], fileName, properties);
  }

  async normalizeHeic(file) {
    if (file.type !== "image/heic" && file.type !== "image/heif") {
      return file;
    }
    const convertedBlob = await heic2any({
      blob: file,
      toType: this.targetFormat,
      quality: 1.0,
    });
    const blob = Array.isArray(convertedBlob)
      ? convertedBlob[0]
      : convertedBlob;
    const fileName = file.name.replace(/\.[^.]+$/, `.${this.targetExtension}`);
    const properties = { type: this.targetFormat };
    return new File([blob], fileName, properties);
  }

  createVariantFilename(name, suffix) {
    const baseName = name.replace(/\.[^.]+$/, "");
    const extension = name.match(/\.([^.]+)$/)[1].toLowerCase();
    return `${baseName}_${suffix}.${extension}`;
  }

  loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        resolve(blob);
      }, type, quality);
    });
  }
}

export default ImageProcessor;