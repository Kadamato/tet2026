import React from "react";
import { motion } from "framer-motion";

const OchnaFlower = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Petals (Yellow) */}
    <path
      d="M50 50 Q30 10 50 10 Q70 10 50 50"
      fill="#facc15"
      stroke="#eab308"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q70 30 90 50 Q70 70 50 50"
      fill="#facc15"
      stroke="#eab308"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q70 90 50 90 Q30 90 50 50"
      fill="#facc15"
      stroke="#eab308"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q10 70 10 50 Q10 30 50 50"
      fill="#facc15"
      stroke="#eab308"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q20 20 20 50 Q50 80 50 50"
      fill="#facc15"
      stroke="#eab308"
      strokeWidth="1"
      transform="rotate(45, 50, 50)"
    />

    {/* Center (Orange/Red) */}
    <circle cx="50" cy="50" r="8" fill="#d97706" />
    <circle cx="50" cy="50" r="4" fill="#b45309" />

    {/* Stamens */}
    <g stroke="#78350f" strokeWidth="1" opacity="0.6">
      <line x1="50" y1="50" x2="50" y2="35" />
      <line x1="50" y1="50" x2="65" y2="50" />
      <line x1="50" y1="50" x2="50" y2="65" />
      <line x1="50" y1="50" x2="35" y2="50" />
      <line x1="50" y1="50" x2="60" y2="40" />
      <line x1="50" y1="50" x2="60" y2="60" />
      <line x1="50" y1="50" x2="40" y2="60" />
      <line x1="50" y1="50" x2="40" y2="40" />
    </g>
  </svg>
);

const PeachFlower = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Petals (Pink) */}
    <path
      d="M50 50 Q30 10 50 10 Q70 10 50 50"
      fill="#f472b6"
      stroke="#db2777"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q70 30 90 50 Q70 70 50 50"
      fill="#f472b6"
      stroke="#db2777"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q70 90 50 90 Q30 90 50 50"
      fill="#f472b6"
      stroke="#db2777"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q10 70 10 50 Q10 30 50 50"
      fill="#f472b6"
      stroke="#db2777"
      strokeWidth="1"
    />
    <path
      d="M50 50 Q20 20 20 50 Q50 80 50 50"
      fill="#f472b6"
      stroke="#db2777"
      strokeWidth="1"
      transform="rotate(45, 50, 50)"
    />

    {/* Center (Dark Pink/Red) */}
    <circle cx="50" cy="50" r="7" fill="#be185d" />

    {/* Stamens */}
    <g stroke="#831843" strokeWidth="1" opacity="0.5">
      <line x1="50" y1="50" x2="50" y2="38" />
      <line x1="50" y1="50" x2="62" y2="50" />
      <line x1="50" y1="50" x2="50" y2="62" />
      <line x1="50" y1="50" x2="38" y2="50" />
    </g>
  </svg>
);

const MarqueeHeader: React.FC = () => {
  const text =
    "Mỗi ngày vào 00:00 sẽ bắn pháo hoa 30 phút từ bây giờ cho đến giao thừa, vào đêm giao thừa sẽ bắn pháo hoa 1 tiếng";

  return (
    <div className="relative w-full h-12 bg-red-950/80 border-b border-yellow-500/30 overflow-hidden flex items-center shadow-lg z-50 backdrop-blur-sm">
      {/* Left Icon - Ochna (Mai) */}
      <div className="flex-shrink-0 z-20 pl-4 bg-gradient-to-r from-red-950/90 to-transparent pr-4 h-full flex items-center">
        <OchnaFlower className="h-8 w-8 md:h-10 md:w-10 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)] " />
      </div>

      {/* Scrolling Container */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <motion.div
          className="whitespace-nowrap flex items-center text-yellow-400 font-serif tracking-widest text-sm md:text-base font-semibold "
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {text}
        </motion.div>
      </div>

      {/* Right Icon - Peach (Dao) */}
      <div className="flex-shrink-0 z-20 pr-4 bg-gradient-to-l from-red-950/90 to-transparent pl-4 h-full flex items-center">
        <PeachFlower className="h-8 w-8 md:h-10 md:w-10 drop-shadow-[0_0_5px_rgba(244,114,182,0.3)] " />
      </div>
    </div>
  );
};

export default MarqueeHeader;
