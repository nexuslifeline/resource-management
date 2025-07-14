import React from "react";

export default function ResourceXLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 text-lg font-bold text-white bg-yellow-400 rounded-full">
        R
      </div>
      <span className="text-xl font-semibold text-gray-800">ResourceX</span>
    </div>
  );
} 