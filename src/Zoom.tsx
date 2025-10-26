import React, { useEffect, useRef } from "react";
import { ProductZoom, ZoomOptions } from "./ProductZoom";

interface Props extends ZoomOptions {
  children: React.ReactElement; // expects an <img />
}

export const Zoom: React.FC<Props> = ({ children, ...options }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new ProductZoom(containerRef.current, options);
    }
  }, [options]);

  return <div ref={containerRef}>{children}</div>;
};
