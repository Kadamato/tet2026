import React from "react";
import { FireworkType } from "../types";

interface TestControlsProps {
  onLaunch: (type: FireworkType) => void;
}

const TestControls: React.FC<TestControlsProps> = ({ onLaunch }) => {
  // Only show if test mode is enabled
  if (!import.meta.env.VITE_ENABLE_TEST_MODE) {
    return null;
  }

  const getIcon = (type: FireworkType) => {
    switch (type) {
      case "sphere":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-2.929-7.071l2.121 2.121M4.929 19.071l2.121-2.121M19.071 4.929l-2.121 2.121M4.929 4.929l2.121 2.121" />
          </svg>
        );
      case "ring":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="2" opacity="0.5" />
          </svg>
        );
      case "willow":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v10" />
            <path d="M12 12c0 4-4 8-8 8" />
            <path d="M12 12c0 4 4 8 8 8" />
            <path d="M12 4c-2 2-2 6-2 8" opacity="0.5" />
            <path d="M12 4c2 2 2 6 2 8" opacity="0.5" />
          </svg>
        );
      case "strobe":
        return (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
            <path d="M4 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" opacity="0.6" />
            <path d="M18 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" opacity="0.6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const types: FireworkType[] = ["sphere", "ring", "willow", "strobe"];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center p-2 rounded-full border border-yellow-500/30 bg-black/60 shadow-[0_0_20px_rgba(234,179,8,0.2)] backdrop-blur-md">
      {/* Glass Background - simplified */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-red-900/40 to-black/40 mix-blend-overlay" />

      {/* Buttons Row - All in one line */}
      <div className="relative z-10 flex items-center gap-3">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onLaunch(type)}
            title={type.toUpperCase()}
            className="group relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-800 to-red-950 border border-yellow-500/20 group-hover:border-yellow-500/60 rounded-full transition-colors" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className="relative z-10 text-yellow-100/90 group-hover:text-yellow-300 transition-colors shadow-black drop-shadow-sm">
              {getIcon(type)}
            </span>
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-yellow-500/30 mx-1" />

        {/* Mix Button - Icon Only */}
        <button
          onClick={() => {
            types.forEach((type, index) => {
              setTimeout(() => onLaunch(type), index * 300);
            });
          }}
          title="MIX ALL"
          className="group relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all transform hover:scale-110 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-600 bg-[length:200%_auto] animate-[shine_3s_linear_infinite]" />
          <div className="absolute inset-0 border border-yellow-200/50 rounded-full" />

          <div className="relative z-10">
            <svg
              className="w-6 h-6 text-white drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.929-7.071l2.121 2.121M4.929 19.071l2.121-2.121M19.071 4.929l-2.121 2.121M4.929 4.929l2.121 2.121" />
              <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TestControls;
