import React from "react";

type ProfileProps = {
  size: number;
  className?: string;
};

export default function Profile({ size, className }: ProfileProps) {
  // Set size value for mimic tailwind class breakpoints (eg h-12 -> height: 48px)
  const tailwindSize = Math.floor(size / 4) * 4;

  return (
    <div className={`${className}`}>
      <div
        style={{ width: `${tailwindSize}px`, height: `${tailwindSize}px` }}
        className={`border-2 border-yellow-800 rounded-full bg-slate-300`}
      ></div>
    </div>
  );
}
