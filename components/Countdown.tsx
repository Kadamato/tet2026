import React, { useState, useEffect } from "react";
import { LUNAR_NEW_YEAR_2026 } from "../constants";
import { TimeLeft } from "../types";
import { motion, AnimatePresence } from "framer-motion";

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +LUNAR_NEW_YEAR_2026 - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12 z-20 relative px-4">
      <TimeBlock value={timeLeft.days} label="Ngày" />
      <TimeBlock value={timeLeft.hours} label="Giờ" />
      <TimeBlock value={timeLeft.minutes} label="Phút" />
      <TimeBlock value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

interface TimeBlockProps {
  value: number;
  label: string;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-24 md:w-32 md:h-40 bg-gradient-to-b from-red-800 to-red-950 rounded-lg shadow-2xl border-2 border-yellow-600/30 flex items-center justify-center overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/textures/black-scales.png')]"></div>

        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl md:text-7xl font-bold text-yellow-400 font-cinzel drop-shadow-md z-10"
          >
            {value < 10 ? `0${value}` : value}
          </motion.span>
        </AnimatePresence>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      </div>
      <span className="mt-4 text-yellow-500/80 font-serif tracking-widest uppercase text-sm md:text-base">
        {label}
      </span>
    </div>
  );
};

export default Countdown;
