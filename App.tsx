import React, { useState, useRef } from "react";
import Countdown from "./components/Countdown";
import Fireworks, { FireworksHandle } from "./components/Fireworks";
import Lantern from "./components/Lantern";
import MarqueeHeader from "./components/MarqueeHeader";
import TestControls from "./components/TestControls";
import { FortuneTeller } from "./components/FortuneTeller";
import { FireworkType } from "./types";

import { motion } from "framer-motion";

const App: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const fireworksRef = useRef<FireworksHandle>(null);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleManualLaunch = (type: FireworkType) => {
    fireworksRef.current?.launch(type);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1a0505] overflow-hidden flex flex-col items-center justify-center text-center select-none pb-20 md:pb-0">
      {/* Marquee Header */}
      <div className="absolute top-0 w-full z-50">
        <MarqueeHeader />
      </div>

      {/* Controls Container */}
      <div className="fixed top-16 right-4 z-50 flex items-center gap-3">
        {/* Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="p-3 bg-red-900/50 hover:bg-red-800/80 rounded-full border border-yellow-500/30 text-yellow-500 transition-colors backdrop-blur-sm"
          aria-label={audioEnabled ? "Mute sound" : "Enable sound"}
        >
          {audioEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Background Gradient & Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c0808] via-[#1a0505] to-[#0f0202]"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('/textures/asfalt-dark.png')] mix-blend-overlay"></div>

      {/* Decorative Lanterns */}
      <div className="absolute top-12 w-full hidden md:flex justify-between px-10 md:px-32 pointer-events-none z-20">
        <Lantern delay={0} className="-ml-10 lg:ml-0 h-32 md:h-40" />
        <Lantern delay={1.5} className="mt-12 hidden md:flex" scale={0.8} />
        <Lantern delay={0.5} className="-mr-10 lg:mr-0 h-32 md:h-40" />
      </div>

      <div className="z-30 flex flex-col items-center gap-6 md:gap-12 p-4 relative w-full max-w-5xl mx-auto mt-12 md:mt-0">
        {/* Headers */}
        <motion.div className="relative z-40">
          <h2 className="text-yellow-500/90 text-lg md:text-2xl font-serif tracking-[0.3em] uppercase mb-2">
            Đếm ngược tới
          </h2>
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 font-cinzel drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            2026
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-[1px] w-8 md:w-12 bg-yellow-500/50"></div>
            <p className="text-red-200 text-lg md:text-2xl font-serif italic tracking-wide">
              Năm con ngựa
            </p>
            <div className="h-[1px] w-8 md:w-12 bg-yellow-500/50"></div>
          </div>
        </motion.div>

        {/* Timer */}
        <Countdown />

        {/* Footer Message */}
        <motion.p className="text-yellow-600 mt-8 md:mt-12 text-xs md:text-sm font-serif max-w-xs md:max-w-md leading-relaxed z-40">
          Chúc bạn một năm mới an khang thịnh vượng, vạn sự như ý. Cầu mong năm
          con ngựa mang đến cho bạn sức mạnh và sự tự do.
        </motion.p>
      </div>

      {/* Interactive & Ambient Fireworks */}
      <Fireworks ref={fireworksRef} audioEnabled={audioEnabled} />

      {/* Fortune Teller */}
      <FortuneTeller audioEnabled={audioEnabled} />

      {/* Test Controls (Environment based) */}
      <TestControls onLaunch={handleManualLaunch} />

      {/* Overlay Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10"></div>
    </div>
  );
};

export default App;
