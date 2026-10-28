import React from 'react';
import { X, Trophy, Gem, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { PRIZE_COMBINATIONS, UserProfile } from '../types/ondice';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onClaimPrize: (prizeId: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onClaimPrize,
}) => {
  if (!isOpen) return null;

  const totalUnlocked = PRIZE_COMBINATIONS.filter(
    (p) => profile.achievements[p.id]?.unlocked
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/20 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                12 Giải Thưởng Ondice
              </h2>
              <p className="text-xs text-white/60">
                Gieo và chọn các tổ hợp Tam & Tứ trong trận để nhận 1 Kim Cương mỗi giải!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tiến độ mở khóa:</span>
            <strong className="text-amber-300">{totalUnlocked} / 12 Giải Thưởng</strong>
          </div>
          <span className="text-cyan-300 font-bold">
            +{totalUnlocked} Kim Cương tiềm năng
          </span>
        </div>

        {/* List of 12 Prize Combinations */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIZE_COMBINATIONS.map((prize) => {
            const ach = profile.achievements[prize.id] || { unlocked: false, claimed: false };
            const isUnlocked = ach.unlocked;
            const isClaimed = ach.claimed;

            return (
              <div
                key={prize.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isClaimed
                    ? 'bg-emerald-950/30 border-emerald-500/30'
                    : isUnlocked
                    ? 'bg-amber-950/40 border-amber-400/50 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    {prize.category === 'tam' ? '3x' : '4x'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Giải: {prize.name}</h4>
                    <p className="text-[11px] text-white/60">
                      Hạng {prize.rank}/36 • {prize.category === 'tam' ? 'Bộ 3 viên giống nhau' : 'Bộ 4 viên tứ quý'}
                    </p>
                  </div>
                </div>

                <div>
                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã nhận</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onClaimPrize(prize.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs rounded-xl shadow-md transition-transform hover:scale-105"
                    >
                      <Gem className="w-3.5 h-3.5 fill-neutral-950" />
                      <span>Nhận 1 KC</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-white/40 text-xs bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                      <Lock className="w-3 h-3" />
                      <span>Chưa gieo</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
