import React, { useState, useRef, useEffect } from "react";
import { Download, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modalTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
  opacity: { duration: 0.2 },
};

interface CalligraphyProps {
  onBack: () => void;
}

const WORDS = [
  { id: "phuc", text: "Phúc", meaning: "Hạnh phúc, may mắn, tốt lành" },
  { id: "loc", text: "Lộc", meaning: "Tài lộc, thịnh vượng" },
  { id: "tho", text: "Thọ", meaning: "Sống lâu, khỏe mạnh" },
  { id: "an", text: "An", meaning: "Bình an, yên ổn" },
  { id: "tam", text: "Tâm", meaning: "Tâm hồn thanh tịnh, hướng thiện" },
  { id: "nhan", text: "Nhẫn", meaning: "Kiên nhẫn, nhẫn nại" },
  { id: "thanh", text: "Thành", meaning: "Thành công, thành đạt" },
];

export const Calligraphy: React.FC<CalligraphyProps> = ({ onBack }) => {
  const [selectedWord, setSelectedWord] = useState<(typeof WORDS)[0] | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCalligraphy = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedWord) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (vertical rectangle for traditional look)
    canvas.width = 800;
    canvas.height = 1200;

    // Background - Red paper texture effect using gradient and noise
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#d22f27"); // Traditional red
    gradient.addColorStop(1, "#b01c15"); // Darker red at bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle texture (gold flecks)
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border
    ctx.strokeStyle = "#fca311"; // Gold color
    ctx.lineWidth = 20;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Text configuration
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Draw Main Word (Vietnamese Calligraphy)
    const fontSize = 300;
    ctx.font = `${fontSize}px "Charm", cursive`;
    ctx.fillStyle = "#1a0505"; // Black ink color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Measure text to center it perfectly
    // const metrics = ctx.measureText(selectedWord.text);
    // const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    ctx.fillText(selectedWord.text, canvas.width / 2, canvas.height / 2 - 50);

    // Draw Meaning (smaller, below)
    // Draw Meaning (smaller, below)
    ctx.font = '40px "Noto Serif", serif';
    ctx.fillStyle = "#fca311"; // Gold for meaning
    ctx.fillText(
      selectedWord.meaning,
      canvas.width / 2,
      canvas.height / 2 + 150,
    );

    // Draw "Xuân Bính Ngọ 2026"
    // Draw "Xuân Bính Ngọ 2026"
    ctx.font = '30px "Noto Serif", serif';
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Xuân Bính Ngọ 2026", canvas.width / 2, canvas.height - 100);

    // Add "Triện" (Seal) - simulated red stamp
    const sealSize = 100;
    const sealX = canvas.width - 120;
    const sealY = canvas.height - 180;

    ctx.shadowColor = "none";
    ctx.fillStyle = "#8b0000"; // Dark red for seal bg
    ctx.roundRect(sealX, sealY, sealSize, sealSize, 10);
    ctx.fill();

    ctx.strokeStyle = "#ffcccc";
    ctx.lineWidth = 3;
    ctx.strokeRect(sealX + 5, sealY + 5, sealSize - 10, sealSize - 10);

    ctx.font = "24px serif";
    ctx.fillStyle = "#ffcccc";
    ctx.fillText("Tết", sealX + sealSize / 2, sealY + sealSize / 2 - 15);
    ctx.fillText("2026", sealX + sealSize / 2, sealY + sealSize / 2 + 15);
  };

  useEffect(() => {
    if (selectedWord) {
      // Small timeout to ensure font is loaded and canvas is ready
      setTimeout(() => {
        renderCalligraphy();
      }, 100);
    }
  }, [selectedWord]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedWord) return;

    const link = document.createElement("a");
    link.download = `XinChu_${selectedWord.id}_2026.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (selectedWord) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 pb-24 md:pb-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={modalTransition}
            className="w-full max-w-4xl flex flex-col items-center gap-2"
          >
            <h2 className="text-3xl font-bold text-yellow-500 font-serif mb-4">
              Ông Đồ Tặng Chữ
            </h2>

            <div className="relative shadow-2xl rounded-lg overflow-hidden max-h-[65vh] w-full flex justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={1200}
                className="h-auto max-h-full w-auto max-w-full object-contain bg-neutral-900 border-2 md:border-4 border-yellow-700/50 rounded-lg"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-8 w-full md:w-auto px-4">
              <button
                onClick={() => setSelectedWord(null)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-full transition-colors border border-stone-600 w-full md:w-auto text-sm md:text-base"
              >
                <RefreshCw size={18} />
                Xin chữ khác
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-600/30 w-full md:w-auto text-sm md:text-base"
              >
                <Download size={18} />
                Tải về máy
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 pb-24 md:pb-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={modalTransition}
          className="w-full max-w-5xl relative"
        >
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={24} /> Quay lại
          </button>

          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-500 font-serif mb-2 md:mb-4">
              Xin Chữ Đầu Xuân
            </h2>
            <p className="text-stone-300 text-base md:text-lg">
              Chọn một chữ ý nghĩa để nhận lộc đầu năm
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 overflow-y-auto max-h-[55vh] p-1 custom-scrollbar">
            {WORDS.map((word) => (
              <button
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="group relative aspect-square bg-red-900/20 border-2 border-red-800/50 rounded-xl hover:bg-red-900/40 hover:border-yellow-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-950/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                <span
                  className="text-3xl md:text-6xl font-serif text-yellow-500/90 group-hover:text-yellow-400 group-hover:scale-110 transition-transform relative z-10"
                  style={{ fontFamily: '"Charm", cursive' }}
                >
                  {word.text}
                </span>

                <span className="text-[10px] md:text-sm text-stone-400 group-hover:text-stone-200 mt-1 md:mt-2 relative z-10 px-2 text-center">
                  {word.meaning}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 md:mt-12 text-center">
            <div className="inline-block p-4 border border-red-900/30 rounded-lg bg-red-950/10">
              <p className="text-stone-500 text-sm italic">
                "Thịt mỡ dưa hành câu đối đỏ
                <br />
                Cây nêu tràng pháo bánh chưng xanh"
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
