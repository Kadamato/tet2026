import React, { useEffect, useCallback, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiCardRandom } from "react-icons/gi";
import { FORTUNES, Fortune } from "../data/fortunes";

const STORE_KEY = "lunar_new_year_fortune_2026";

// --- State Management (useReducer) ---

interface FortuneState {
  isOpen: boolean;
  step: "intro" | "shaking" | "result";
  fortune: Fortune | null;
  canDraw: boolean;
}

type FortuneAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "START_SHAKING" }
  | { type: "DRAW_FORTUNE"; payload: Fortune }
  | { type: "RESTORE_FORTUNE"; payload: { fortune: Fortune; canDraw: boolean } }
  | { type: "RESET_STEP" };

function fortuneReducer(
  state: FortuneState,
  action: FortuneAction,
): FortuneState {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        isOpen: true,
        step:
          !state.canDraw && state.fortune ? "result" : "intro",
      };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "START_SHAKING":
      return { ...state, step: "shaking" };
    case "DRAW_FORTUNE":
      return {
        ...state,
        fortune: action.payload,
        step: "result",
        canDraw: false,
      };
    case "RESTORE_FORTUNE":
      return {
        ...state,
        fortune: action.payload.fortune,
        canDraw: action.payload.canDraw,
        step: !action.payload.canDraw ? "result" : state.step,
      };
    case "RESET_STEP":
      return {
        ...state,
        step: state.canDraw ? "intro" : state.step,
      };
    default:
      return state;
  }
}

const initialState: FortuneState = {
  isOpen: false,
  step: "intro",
  fortune: null,
  canDraw: true,
};

// --- Animation Variants (module-level constants) ---

const modalTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
  opacity: { duration: 0.2 },
};

const buttonSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
};

const stepTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
  opacity: { duration: 0.2 },
};

const introVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const shakingVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const resultContainerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const resultChildVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

// --- Component ---

interface FortuneTellerProps {
  audioEnabled: boolean;
}

const FortuneTellerComponent: React.FC<FortuneTellerProps> = ({
  audioEnabled,
}) => {
  const [state, dispatch] = useReducer(fortuneReducer, initialState);
  const { isOpen, step, fortune, canDraw } = state;

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Check if user has already drawn today
  useEffect(() => {
    const savedData = localStorage.getItem(STORE_KEY);
    if (savedData) {
      try {
        const { date, fortuneId } = JSON.parse(savedData);
        const today = new Date().toDateString();
        if (date === today) {
          const savedFortune = FORTUNES.find((f) => f.id === fortuneId);
          if (savedFortune) {
            dispatch({
              type: "RESTORE_FORTUNE",
              payload: { fortune: savedFortune, canDraw: false },
            });
          }
        }
      } catch {
        localStorage.removeItem(STORE_KEY);
      }
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleOpen = useCallback(() => {
    dispatch({ type: "OPEN" });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE" });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const startShaking = useCallback(() => {
    if (audioEnabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio("/coin-drop.mp3");
      }
      audioRef.current.volume = 0.6;
      audioRef.current.loop = true;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.warn("Audio play failed", e));
    }
    dispatch({ type: "START_SHAKING" });
  }, [audioEnabled]);

  const drawFortune = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const randomIndex = Math.floor(Math.random() * FORTUNES.length);
    const selectedFortune = FORTUNES[randomIndex];
    dispatch({ type: "DRAW_FORTUNE", payload: selectedFortune });

    const today = new Date().toDateString();
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ date: today, fortuneId: selectedFortune.id }),
    );
  }, []);

  const handleExitComplete = useCallback(() => {
    dispatch({ type: "RESET_STEP" });
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={buttonSpring}
        onClick={handleOpen}
        style={{ willChange: "transform" }}
        className="fixed top-16 left-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 bg-red-800 text-yellow-400 border-2 border-yellow-500 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] font-serif font-bold text-xs md:text-sm leading-tight text-center"
      >
        <span className="md:w-8 md:h-8 flex items-center justify-center">
          <GiCardRandom size={28} />
        </span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 md:py-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              style={{ willChange: "opacity" }}
              className="absolute inset-0 bg-black/85"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={modalTransition}
              style={{ willChange: "transform, opacity" }}
              className="relative bg-[#2c0808] border-2 border-yellow-600 rounded-lg w-full max-w-lg max-h-[85vh] md:max-h-none flex flex-col shadow-[0_0_50px_rgba(220,38,38,0.3)] text-center overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('/textures/black-scales.png')] mix-blend-overlay pointer-events-none"></div>

              <div className="relative flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-2 right-2 z-10 text-yellow-500/50 hover:text-yellow-500 p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <AnimatePresence mode="popLayout">
                  {step === "intro" && (
                    <motion.div
                      key="intro"
                      variants={introVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={stepTransition}
                      style={{ willChange: "transform, opacity" }}
                      className="flex flex-col items-center gap-4 md:gap-6 pt-2"
                    >
                      <h2 className="text-xl md:text-3xl font-serif text-yellow-500 font-bold uppercase tracking-wider">
                        Gieo Quẻ Đầu Năm
                      </h2>
                      <div className="text-red-100/90 font-serif leading-relaxed space-y-4 text-sm md:text-base">
                        <p>
                          "Lòng thành xin chớ vội vàng
                          <br />
                          Tĩnh tâm suy nghĩ, nhẹ nhàng cầu xin"
                        </p>
                        <p className="text-xs md:text-sm italic opacity-80">
                          Hãy nhắm mắt lại, hít thở sâu, và tập trung vào điều
                          bạn mong muốn trong năm mới. Khi tâm đã tịnh, hãy nhấn
                          nút bên dưới.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={buttonSpring}
                        onClick={startShaking}
                        style={{ willChange: "transform" }}
                        className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-red-700 to-red-900 border border-yellow-500 rounded text-yellow-400 font-bold text-sm md:text-base tracking-widest uppercase shadow-lg hover:shadow-yellow-500/20 transition-all"
                      >
                        Tâm Thành Đã Nguyện
                      </motion.button>
                    </motion.div>
                  )}

                  {step === "shaking" && (
                    <motion.div
                      key="shaking"
                      variants={shakingVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-8 py-8"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, -12, 10, -10, 12, -8, 6, 0],
                          y: [0, -6, 4, -5, 6, -3, 2, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: 4,
                          ease: [0.36, 0.07, 0.19, 0.97],
                          repeatType: "loop",
                        }}
                        onAnimationComplete={drawFortune}
                        style={{ willChange: "transform" }}
                        className="w-24 h-36 md:w-32 md:h-48 bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-lg border-4 border-yellow-500 relative flex items-center justify-center shadow-2xl"
                      >
                        <div className="absolute top-0 w-full h-full bg-[url('/textures/wood-pattern.png')] opacity-30 mix-blend-multiply"></div>
                        <motion.div
                          className="text-4xl md:text-6xl text-yellow-500/80"
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 0.25,
                            repeat: 11,
                            ease: "easeOut",
                          }}
                        >
                          ☲
                        </motion.div>
                      </motion.div>
                      <p className="text-yellow-400 font-serif animate-pulse">
                        Đang gieo quẻ...
                      </p>
                    </motion.div>
                  )}

                  {step === "result" && fortune && (
                    <motion.div
                      key="result"
                      variants={resultContainerVariants}
                      initial="initial"
                      animate="animate"
                      style={{ willChange: "transform, opacity" }}
                      className="flex flex-col items-center gap-3 md:gap-4 text-center pb-4"
                    >
                      <motion.div
                        variants={resultChildVariants}
                        className="w-full border-b border-yellow-500/30 pb-2 mb-2"
                      >
                        <span className="text-yellow-600/70 font-serif text-xs md:text-sm uppercase tracking-[0.2em] block mb-1">
                          Quẻ Số {fortune.id}
                        </span>
                        <h3 className="text-xl md:text-3xl text-yellow-400 font-bold font-serif uppercase">
                          {fortune.title}
                        </h3>
                      </motion.div>

                      <motion.div
                        variants={resultChildVariants}
                        className="my-2 md:my-4 space-y-2"
                      >
                        {fortune.poem.map((line, idx) => (
                          <p
                            key={idx}
                            className="text-red-100 text-base md:text-lg font-serif italic"
                          >
                            {line}
                          </p>
                        ))}
                      </motion.div>

                      <motion.div
                        variants={resultChildVariants}
                        className="bg-black/20 p-3 md:p-4 rounded border border-yellow-500/10 w-full mt-2 text-left md:text-center"
                      >
                        <p className="text-yellow-500 font-bold mb-1 font-serif text-sm md:text-base">
                          Ý Nghĩa
                        </p>
                        <p className="text-red-200 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                          {fortune.meaning}
                        </p>

                        <p className="text-yellow-500 font-bold mb-1 font-serif text-sm md:text-base">
                          Lời Giải
                        </p>
                        <p className="text-red-200 text-xs md:text-sm leading-relaxed">
                          {fortune.interpretation}
                        </p>
                      </motion.div>

                      {!canDraw && (
                        <motion.p
                          variants={resultChildVariants}
                          className="text-[10px] md:text-xs text-yellow-500/50 mt-4 italic"
                        >
                          Bạn đã gieo quẻ hôm nay. Hãy quay lại vào ngày mai.
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

FortuneTellerComponent.displayName = "FortuneTeller";

export const FortuneTeller = React.memo(FortuneTellerComponent);
