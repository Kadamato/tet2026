import React from 'react';
import { motion } from 'framer-motion';

interface LanternProps {
  delay?: number;
  className?: string;
  scale?: number;
}

const Lantern: React.FC<LanternProps> = ({ delay = 0, className = '', scale = 1 }) => {
  return (
    <motion.div
      className={`absolute flex flex-col items-center ${className}`}
      initial={{ rotate: -5 }}
      animate={{ rotate: 5 }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
      style={{ scale }}
    >
      {/* String */}
      <div className="w-0.5 h-16 bg-yellow-600/80 mb-[-2px]"></div>
      
      {/* Lantern Body */}
      <div className="relative w-24 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl shadow-[0_0_30px_rgba(255,100,0,0.4)] border-2 border-yellow-500/30 flex items-center justify-center">
        {/* Inner Gold Decor */}
        <div className="absolute w-16 h-14 border border-yellow-500/40 rounded-2xl"></div>
        <div className="text-yellow-400 font-serif text-2xl font-bold opacity-80 select-none"></div>
        
        {/* Top/Bottom Caps */}
        <div className="absolute -top-3 w-12 h-4 bg-yellow-600 rounded-t-lg shadow-sm"></div>
        <div className="absolute -bottom-3 w-12 h-4 bg-yellow-600 rounded-b-lg shadow-sm"></div>
      </div>

      {/* Tassels */}
      <div className="mt-[-2px] flex space-x-2">
         <div className="w-1 h-12 bg-red-500"></div>
         <div className="w-1 h-16 bg-red-600"></div>
         <div className="w-1 h-12 bg-red-500"></div>
      </div>
    </motion.div>
  );
};

export default Lantern;