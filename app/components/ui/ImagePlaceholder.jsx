import React from "react";

function ImagePlaceholder({ aspect = "video", className = "" }) {
  // aspect: "video" => 16:9, "square" => 1:1, "wide" => 3:2, "fourThree" => 4:3
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
      ? "aspect-[3/2]"
      : aspect === "fourThree"
      ? "aspect-[4/3]"
      : "aspect-video";
  return (
    <div className={`w-full ${aspectClass} bg-neutral-200 border border-neutral-300 rounded-xl ${className}`}> {/* [Placeholder: Image] */}</div>
  );
}

export default ImagePlaceholder;



