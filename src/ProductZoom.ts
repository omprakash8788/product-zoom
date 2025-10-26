
import { clamp } from "./utils/clamp";

export interface ZoomOptions {
  zoomLevel?: number;
  lens?: boolean;
  lensSize?: number;
  transition?: string;
}

export class ProductZoom {
  private container: HTMLElement;
  private img: HTMLImageElement;
  private lens: HTMLElement | null = null;
  private zoomLevel: number;
  private lensSize: number;
  private transition: string;

  constructor(container: HTMLElement, options: ZoomOptions = {}) {
    this.container = container;
    const img = container.querySelector<HTMLImageElement>("img");
    if (!img) throw new Error("Zoom: container must have an <img> child");
    this.img = img;

    this.zoomLevel = options.zoomLevel || 2;
    this.lensSize = options.lensSize || 100;
    this.transition = options.transition || "transform 0.3s ease";

    this.createLens();
    this.init();
  }

private createLens() {
  this.lens = document.createElement("div");
  this.lens.classList.add("pz-lens");
  this.lens.style.width = `${this.lensSize}px`;
  this.lens.style.height = `${this.lensSize}px`;
  this.container.style.position = "relative";
  this.container.appendChild(this.lens);

  // Inject lens CSS if not exists
  if (!document.getElementById("pz-lens-style")) {
    const style = document.createElement("style");
    style.id = "pz-lens-style";
    style.innerHTML = `
      .pz-lens {
        position: absolute;
        border: 2px solid rgba(0,0,0,0.3);
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 8px rgba(0,0,0,0.4);
        background-repeat: no-repeat;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
    `;
    document.head.appendChild(style);
  }
}


  private init() {
    this.img.style.transition = this.transition;
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mouseleave", this.onMouseLeave);
  }

private onMouseMove = (e: MouseEvent) => {
  this.lens!.style.opacity = "1"; // Lens visible
  const rect = this.img.getBoundingClientRect();
  const x = clamp(e.clientX - rect.left, 0, rect.width);
  const y = clamp(e.clientY - rect.top, 0, rect.height);

  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;

  this.img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  this.img.style.transform = `scale(${this.zoomLevel})`;

  this.lens!.style.left = `${x - this.lensSize / 2}px`;
  this.lens!.style.top = `${y - this.lensSize / 2}px`;

  this.lens!.style.backgroundImage = `url(${this.img.src})`;
  this.lens!.style.backgroundSize = `${rect.width * this.zoomLevel}px ${rect.height * this.zoomLevel}px`;
  this.lens!.style.backgroundPosition = `-${x * this.zoomLevel - this.lensSize / 2}px -${y * this.zoomLevel - this.lensSize / 2}px`;
};


private onMouseLeave = () => {
  this.img.style.transform = "scale(1)";
  this.img.style.transformOrigin = "center center";
  
  if (this.lens) {
    this.lens.style.opacity = "0"; // Hide lens
  }
};

}
