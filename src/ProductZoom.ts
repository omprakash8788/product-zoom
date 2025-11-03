import { clamp } from "./utils/clamp";

export interface ZoomOptions {
  zoomLevel?: number;
  lensSize?: number;
  zoomBoxWidth?: number;
  zoomBoxHeight?: number;
  gap?: number;
}

export class ProductZoom {
  private container: HTMLElement;
  private img: HTMLImageElement;
  private lens: HTMLElement | null = null;
  private zoomBox: HTMLElement | null = null;
  private zoomLevel: number;
  private lensSize: number;
  private zoomBoxWidth: number;
  private zoomBoxHeight: number;
  private gap: number;

  constructor(container: HTMLElement, options: ZoomOptions = {}) {
    this.container = container;
    const img = container.querySelector<HTMLImageElement>("img");
    if (!img) throw new Error("Zoom: container must have an <img> child");
    this.img = img;

    this.zoomLevel = options.zoomLevel || 2.5;
    this.lensSize = options.lensSize || 120;
    this.zoomBoxWidth = options.zoomBoxWidth || 400;
    this.zoomBoxHeight = options.zoomBoxHeight || 400;
    this.gap = options.gap || 15;

    this.createLens();
    this.createZoomBox();
    this.init();
  }

  private createLens() {
    this.lens = document.createElement("div");
    this.lens.classList.add("pz-lens");
    this.lens.style.width = `${this.lensSize}px`;
    this.lens.style.height = `${this.lensSize}px`;
    this.container.style.position = "relative";
    this.container.appendChild(this.lens);
  }

  private createZoomBox() {
    this.zoomBox = document.createElement("div");
    this.zoomBox.classList.add("pz-zoom-box");
    this.zoomBox.style.width = `${this.zoomBoxWidth}px`;
    this.zoomBox.style.height = `${this.zoomBoxHeight}px`;
    document.body.appendChild(this.zoomBox);

    if (!document.getElementById("pz-style")) {
      const style = document.createElement("style");
      style.id = "pz-style";
      style.innerHTML = `
        .pz-lens {
          position: absolute;
          border: 2px solid rgba(0,0,0,0.3);
          border-radius: 50%;
          pointer-events: none;
          background: rgba(255,255,255,0.2);
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .pz-zoom-box {
          position: absolute;
          border: 1px solid #ddd;
          overflow: hidden;
          background-repeat: no-repeat;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10000;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private init() {
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mouseleave", this.onMouseLeave);
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.img.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    // Show lens + zoom box
    this.lens!.style.opacity = "1";
    this.zoomBox!.style.opacity = "1";

    // Position the lens
    this.lens!.style.left = `${x - this.lensSize / 2}px`;
    this.lens!.style.top = `${y - this.lensSize / 2}px`;

    // Position the zoom box to the right
    this.zoomBox!.style.left = `${rect.right + this.gap}px`;
    this.zoomBox!.style.top = `${rect.top}px`;

    // Calculate background size and position
    this.zoomBox!.style.backgroundImage = `url(${this.img.src})`;
    this.zoomBox!.style.backgroundSize = `${rect.width * this.zoomLevel}px ${rect.height * this.zoomLevel}px`;

    const bgX = -x * this.zoomLevel + this.zoomBoxWidth / 2;
    const bgY = -y * this.zoomLevel + this.zoomBoxHeight / 2;

    this.zoomBox!.style.backgroundPosition = `${bgX}px ${bgY}px`;
  };

  private onMouseLeave = () => {
    this.lens!.style.opacity = "0";
    this.zoomBox!.style.opacity = "0";
  };
}
