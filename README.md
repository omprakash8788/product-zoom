# @omprakash/product-zoom

A lightweight, dependency-free product image zoom package with lens effect — works just like Amazon!  
Simply wrap your `<img>` inside `<Zoom>` component — no extra setup needed.

---

## Features

✅ Hover to Zoom  
✅ Amazon-style Lens  
✅ Smooth Animation  
✅ Supports Any Image  
✅ Fully Typed (TypeScript)  
✅ Mobile-friendly groundwork  
✅ Developer can override CSS freely

---

## Installation

```bash
npm install @omprakash/product-zoom
# or
yarn add @omprakash/product-zoom


### Usage 
 \`\`\`ts
import Zoom from "@omprakash/product-zoom";
import productImg from "./product.jpg";

export default function App() {
  return (
    <Zoom zoomLevel={2}>
      <img src={productImg} alt="Product" width={300} />
    </Zoom>
  );
}
 \`\`\`