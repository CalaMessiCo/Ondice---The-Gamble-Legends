import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface Dice3DProps {
  values: [number, number, number, number];
  isRolling: boolean;
  isCounterAttack?: boolean;
  selectedIndices?: number[];
  onDieClick?: (index: number) => void;
  interactive?: boolean;
}

const PIP_COORDINATES: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [25, 75], [75, 25], [75, 75]],
  5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
  6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
};

export const Dice3D: React.FC<Dice3DProps> = ({
  values,
  isRolling,
  isCounterAttack = false,
  selectedIndices = [],
  onDieClick,
  interactive = false,
}) => {
  return (
    <div className="relative flex items-center justify-center gap-3 sm:gap-5 py-3">
      {/* Flaming Counter-Attack Backdrop if active */}
      {isCounterAttack && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.05 }}
          className="absolute inset-0 -inset-x-6 bg-gradient-to-r from-red-600/30 via-orange-500/40 to-amber-500/30 blur-xl rounded-3xl pointer-events-none"
        />
      )}

      {values.map((val, idx) => {
        const isSelected = selectedIndices.includes(idx);
        const pips = PIP_COORDINATES[val] || PIP_COORDINATES[1];

        return (
          <motion.div
            key={idx}
            id={`ondice-die-${idx}`}
            onClick={() => interactive && onDieClick && onDieClick(idx)}
            whileHover={interactive ? { scale: 1.08, y: -4 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
            animate={
              isRolling
                ? {
                    rotateX: [0, 360, 720, 1080],
                    rotateY: [0, 720, 1440],
                    rotateZ: [0, 180, 360],
                    scale: [1, 1.15, 0.9, 1.05, 1],
                    y: [0, -28, 6, -12, 0],
                  }
                : isCounterAttack
                ? {
                    y: [0, -10, 0, -6, 0],
                    scale: [1, 1.08, 1, 1.04, 1],
                    transition: { repeat: Infinity, duration: 1.2 },
                  }
                : {
                    scale: isSelected ? 1.06 : 1,
                    y: isSelected ? -6 : 0,
                  }
            }
            transition={
              isRolling
                ? { duration: 0.85, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 350, damping: 20 }
            }
            className={`relative select-none transition-all duration-200 ${
              interactive ? 'cursor-pointer' : ''
            }`}
          >
            {/* Fire trail and particle flame aura when Phản Công is triggered */}
            {isCounterAttack && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute -inset-2.5 rounded-2xl bg-gradient-to-t from-orange-600 to-amber-400 blur-sm pointer-events-none"
              />
            )}

            {/* Die Body */}
            <div
              className={`relative w-14 h-14 sm:w-18 sm:h-18 rounded-2xl p-1.5 shadow-2xl transition-all border-2 flex items-center justify-center ${
                isCounterAttack
                  ? 'bg-gradient-to-br from-amber-100 via-white to-red-100 border-red-500 shadow-red-500/50'
                  : isSelected
                  ? 'bg-white border-amber-400 ring-4 ring-amber-400/40 shadow-amber-400/40'
                  : 'bg-white border-white/80 shadow-black/25'
              }`}
            >
              {/* Inner bezel effect */}
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-white to-neutral-100 shadow-inner">
                {pips.map(([x, y], pIdx) => (
                  <div
                    key={pIdx}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
                      val === 1 || val === 4
                        ? isCounterAttack
                          ? 'w-3 h-3 sm:w-4 sm:h-4 bg-red-600 shadow-sm shadow-red-500'
                          : 'w-3 h-3 sm:w-4 sm:h-4 bg-red-500'
                        : isCounterAttack
                        ? 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-neutral-900'
                        : 'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-neutral-800'
                    }`}
                  />
                ))}
              </div>

              {/* Flame mini-badge if counter-attack */}
              {isCounterAttack && (
                <div className="absolute -top-3 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg shadow-red-600/50 animate-bounce">
                  <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-300" />
                </div>
              )}
            </div>

            {/* Selected Indicator Pill */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-300 shadow-sm whitespace-nowrap"
              >
                ĐÃ CHỌN
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
