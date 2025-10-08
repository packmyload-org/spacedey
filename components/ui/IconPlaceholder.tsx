import React from "react";

function IconPlaceholder({ shape = "circle", size = 48, className = "" }) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  const common = `bg-brand/10 text-brand flex items-center justify-center ${className}`;
  if (shape === "square") {
    return <div className={`rounded-lg ${common}`} style={{ width: dimension, height: dimension }} />;
  }
  return <div className={`rounded-full ${common}`} style={{ width: dimension, height: dimension }} />;
}

export default IconPlaceholder;



