"use client";
import { useState, useRef } from "react";

export default function Tooltip({ content, children }: { content: any; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 600);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 w-max px-3 py-1 text-sm text-white bg-gray-800 rounded-lg shadow-lg transition-opacity duration-200 z-50">
          <div>{content}</div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-7 w-3 h-3 rotate-45 bg-gray-800"></div>
        </div>
      )}
    </div>
  );
}
