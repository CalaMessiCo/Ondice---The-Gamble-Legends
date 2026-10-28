import React from 'react';
import { X, Trophy, Crown, Sparkles, Gem, Lock, Medal } from 'lucide-react';
import { UserProfile, TierType } from '../types/ondice';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  tier: TierType;
  onUnlockLeaderboard: () => void;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  totalSeatPoints: number;
  matchesWon: number;
  tier: TierType;
  isUser?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  tier,
  onUnlockLeaderboard,
}) => {
  if (!isOpen) return null;

  const isUnlocked = profile.unlockedLeaderboard || tier !== 'free';

  // Realistic mock players combined with current user's actual stats
  const initialRanks: LeaderboardEntry[] = [
    { rank: 1, name: 'DragonMaster_VN', avatar: '🐉', totalSeatPoints: 142, matchesWon: 28, tier: 'max' as TierType },
    { rank: 2, name: 'Thần Xúc Xắc 88', avatar: '⚡️', totalSeatPoints: 119, matchesWon: 22, tier: 'vip' as TierType },
    { rank: 3, name: 'Minh Hoàng Pro', avatar: '🦁', totalSeatPoints: 96, matchesWon: 18, tier: 'vip' as TierType },
    { rank: 4, name: 'Bảo Anh Dice', avatar: '🎯', totalSeatPoints: 74, matchesWon: 14, tier: 'vip' as TierType },
    { rank: 5, name: 'Bạn (Người Chơi)', avatar: '🎲', totalSeatPoints: profile.totalSeatPoints || 12, matchesWon: profile.matchesWon || 2, tier, isUser: true },
    { rank: 6, name: 'Trọng Nghĩa VN', avatar: '🦊', totalSeatPoints: 48, matchesWon: 9, tier: 'free' as TierType },
    { rank: 7, name: 'Anh Quân Lucky', avatar: '🍀', totalSeatPoints: 35, matchesWon: 6, tier: 'free' as TierType },
  ].sort((a, b) => b.totalSeatPoints - a.totalSeatPoints).map((item, idx) => ({ ...item, rank: idx + 1 }));

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
                Bảng Xếp Hạng Tọa Điểm Ondice
              </h2>
              <p className="text-xs text-white/60">
                Xếp hạng vinh danh theo tổng số Tọa Điểm tích lũy trên hệ thống
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

        {/* Locked State if not unlocked */}
        {!isUnlocked ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Bảng Xếp Hạng Đang Bị Khóa</h3>
              <p className="text-xs text-white/70 max-w-sm mt-1">
                Cần <strong>15 Kim Cương</strong> để mở khóa vĩnh viễn tính năng Bảng Xếp Hạng (Hoặc được tặng kèm miễn phí khi kích hoạt Gói VIP/MAX)!
              </p>
            </div>

            <button
              onClick={onUnlockLeaderboard}
              disabled={profile.diamonds < 15}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg transition-transform ${
                profile.diamonds >= 15
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white hover:scale-105'
                  : 'bg-neutral-800 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              <Gem className="w-4 h-4 fill-cyan-400" />
              <span>Mở Khóa Ngay (15 Kim Cương - Có: {profile.diamonds} KC)</span>
            </button>
          </div>
        ) : (
          /* Unlocked Leaderboard Table */
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-white/50 px-3 uppercase tracking-wider">
              <span>Hạng / Người Chơi</span>
              <span>Tổng Tọa Điểm / Trận Thắng</span>
            </div>

            {initialRanks.map((entry) => {
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.name}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    entry.isUser
                      ? 'bg-amber-500/20 border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                      : isTop3
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 text-center font-black text-sm flex items-center justify-center">
                      {entry.rank === 1 ? (
                        <Medal className="w-5 h-5 text-yellow-400" />
                      ) : entry.rank === 2 ? (
                        <Medal className="w-5 h-5 text-neutral-300" />
                      ) : entry.rank === 3 ? (
                        <Medal className="w-5 h-5 text-amber-600" />
                      ) : (
                        <span className="text-white/60">#{entry.rank}</span>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm border border-white/15">
                      {entry.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">
                          {entry.name}
                        </span>
                        {entry.tier === 'max' && (
                          <span className="text-[9px] bg-neutral-900 text-amber-300 border border-amber-400 px-1.5 rounded font-black">
                            MAX
                          </span>
                        )}
                        {entry.tier === 'vip' && (
                          <span className="text-[9px] bg-purple-600 text-white px-1.5 rounded font-black">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/50">
                        {entry.isUser ? 'Chỉ số của bạn' : 'Cao thủ kỳ cựu'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-amber-300">
                      {entry.totalSeatPoints} Tọa Điểm
                    </div>
                    <div className="text-[10px] text-white/60">
                      {entry.matchesWon} trận thắng
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
