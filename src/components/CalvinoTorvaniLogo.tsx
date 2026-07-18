import React from "react";

interface CalvinoTorvaniLogoProps {
  className?: string;
  variant?: "full" | "monogram" | "text" | "compact";
  iconSize?: number;
}

export default function CalvinoTorvaniLogo({ 
  className = "", 
  variant = "full",
  iconSize = 80
}: CalvinoTorvaniLogoProps) {
  
  // Custom interlocking CT vector path
  const renderMonogram = (size: number) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-espresso"
      >
        {/* Deep, organic brown brand color: #2E1A16 */}
        {/* GENTLE CIRCULAR C */}
        <path
          d="M 124 45 
             C 114 36, 102 32, 88 32 
             C 48 32, 28 62, 28 100 
             C 28 138, 48 168, 88 168 
             C 102 168, 114 164, 124 155"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="serif"
          fill="none"
        />
        {/* SERIF TERMINAL C (UPPER) */}
        <path
          d="M 119 49 L 128 41 L 126 59 Z"
          fill="currentColor"
        />
        {/* SERIF TERMINAL C (LOWER) */}
        <path
          d="M 119 151 L 128 159 L 126 141 Z"
          fill="currentColor"
        />

        {/* ELEGANT SERIF T */}
        {/* T-Bar */}
        <path
          d="M 46 64 L 154 64 L 154 75 L 142 75 L 142 70 L 58 70 L 58 75 L 46 75 Z"
          fill="currentColor"
        />
        {/* T-Stem */}
        <path
          d="M 94 66 L 106 66 L 106 156 L 118 156 L 118 162 L 82 162 L 82 156 L 94 156 Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  if (variant === "monogram") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderMonogram(iconSize)}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <span className={`font-serif tracking-[0.25em] text-espresso uppercase ${className}`}>
        Calvino Torvani
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderMonogram(32)}
        <span className="font-serif tracking-[0.25em] text-xs md:text-sm text-espresso uppercase font-semibold">
          Calvino Torvani
        </span>
      </div>
    );
  }

  // "full" vertical stacked version
  return (
    <div className={`flex flex-col items-center text-center space-y-4 ${className}`}>
      {renderMonogram(iconSize)}
      <div className="space-y-1">
        <h2 className="font-serif tracking-[0.28em] text-xl md:text-2xl text-espresso uppercase font-semibold">
          Calvino Torvani
        </h2>
        <span className="text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-gold-burnished block font-semibold">
          Florence • Digital Atelier
        </span>
      </div>
    </div>
  );
}
