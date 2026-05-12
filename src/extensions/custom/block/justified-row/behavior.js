import Behavior from "../../../behavior.js";

class JustifiedRowBehavior extends Behavior {
  constructor(type) {
    super(type);
  }

  mount(root) {
    const images = root.querySelectorAll(".justified-row .justified-row-item img");
    Promise.all(Array.from(images).map(img => {
      return new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    })).then(() => {
      this.cacheItemRatios(root);
      this.applyItemRatios(root);
    });
  }

  unmount(root) {
    return;
  }
  
  cacheItemRatios(root) {
    if (!root) return;
    root.querySelectorAll(".justified-row").forEach(row => {
      const items = row.querySelectorAll(".justified-row-item");
      items.forEach(item => {
        const width = item.offsetWidth;
        const height = item.offsetHeight;
        if (width > 0 && height > 0) {
          item.style.setProperty("--item-ratio-cache", width / height);
        } else {
          item.style.setProperty("--item-ratio-cache", 1);
        }
      })
    });
  }

  applyItemRatios(root) {
    if (!root) return;
    root.querySelectorAll(".justified-row").forEach(row => {
      const items = row.querySelectorAll(".justified-row-item");
      items.forEach(item => {
        const itemRatio = item.style.getPropertyValue("--item-ratio-cache");
        if (itemRatio) {
          item.style.setProperty("--item-ratio", itemRatio);
          item.style.removeProperty("--item-ratio-cache");
        }
      })
    });
  }
}

export { JustifiedRowBehavior };