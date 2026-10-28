import React from 'react';
import { 
  Crown, 
  Gem, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Gamepad2, 
  ShoppingBag,
  Flame,
  Users
} from 'lucide-react';
import { TierType, UserProfile } from '../types/ondice';

interface HeaderProps {
  profile: UserProfile;
  tier: TierType;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenRules: () => void;
  onOpenMinigames: () => void;
  onOpenLobby: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerCat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  tier,
  onOpenShop,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenRules,
  onOpenMinigames,
  onOpenLobby,
  soundEnabled,
  onToggleSound,
  onTriggerCat,
}) => {
  const getTierBadge = () => {
    switch (tier) {
      case 'max':
        return {
          label: 'GÓI MAX',
          class: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 shadow-amber-500/20 border-amber-300',
          icon: <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />,
        };
      case 'vip':
        return {
          label: 'GÓI VIP',
          class: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30 border-purple-300',
          icon: <Crown className="w-3.5 h-3.5 fill-white" />,
        };
      case 'free':
      default:
        return {
          label: 'MIỄN PHÍ',
          class: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <Flame className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  const badge = getTierBadge();

  return (
    <header className="w-full max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Tier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black tracking-wider text-white">🎲</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                ONDICE
              </h1>
              <div
                onClick={onOpenShop}
                className={`flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full border shadow cursor-pointer transition-transform hover:scale-105 ${badge.class}`}
                title="Nhấn để xem quyền lợi gói hoặc nâng cấp"
              >
                {badge.icon}
                <span>{badge.label}</span>
              </div>

              {onTriggerCat && (
                <button
                  onClick={onTriggerCat}
                  className="flex items-center gap-1 text-[11px] font-bold bg-neutral-900/60 hover:bg-neutral-900/90 text-amber-300 border border-amber-400/40 hover:border-amber-300 px-2 py-0.5 rounded-full transition-all hover:scale-105 cursor-pointer shadow"
                  title="Linh vật Ondice Cat - Bấm để nghe mèo cổ vũ và cho lời khuyên"
                >
                  <span className="text-xs">🐾</span>
                  <span className="hidden sm:inline font-['Outfit',sans-serif]">Ondice Cat</span>
                </button>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-white/80 font-medium hidden sm:block">
              Trò chơi xúc xắc may rủi chiến thuật
            </p>
          </div>
        </div>
      </div>

      {/* Nav Actions & Economy */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Diamond Counter */}
        <div
          id="ondice-diamond-counter"
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-bold text-sm shadow-md cursor-pointer hover:border-cyan-300 transition-all hover:scale-105"
          title="Kim Cương (Dùng để mở khóa VIP, Minigame, Khiên, Buff)"
        >
          <Gem className="w-4 h-4 text-cyan-300 fill-cyan-400" />
          <span className="text-cyan-100">{profile.diamonds}</span>
          <span className="text-[10px] text-cyan-200 uppercase tracking-wider hidden sm:inline">KC</span>
        </div>

        {/* Room / Lobby */}
        <button
          id="ondice-btn-lobby"
          onClick={onOpenLobby}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          title="Đấu người thật & Phòng chơi"
        >
          <Users className="w-4 h-4 text-emerald-300" />
          <span className="hidden md:inline">Phòng Chơi</span>
        </button>

        {/* Minigames */}
        <button
          id="ondice-btn-minigames"
          onClick={onOpenMinigames}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          title="Minigames: Ondice Đảo Ngược & Ondice Cộng Dồn"
        >
          <Gamepad2 className="w-4 h-4 text-yellow-300" />
          <span className="hidden md:inline">Minigames</span>
        </button>

        {/* Achievements / Prizes */}
        <button
          id="ondice-btn-achievements"
          onClick={onOpenAchievements}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          title="12 Giải thưởng tam & tứ (Nhận Kim Cương)"
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span className="hidden md:inline">Giải Thưởng</span>
        </button>

        {/* Leaderboard */}
        <button
          id="ondice-btn-leaderboard"
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
          title="Bảng Xếp Hạng Tọa Điểm"
        >
          <Crown className="w-4 h-4 text-purple-300" />
          <span className="hidden md:inline">Xếp Hạng</span>
        </button>

        {/* Shop */}
        <button
          id="ondice-btn-shop"
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-neutral-950 font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          title="Cửa hàng VIP, MAX, Khiên & Thuốc Buff"
        >
          <ShoppingBag className="w-4 h-4 fill-neutral-950" />
          <span>Cửa Hàng</span>
        </button>

        {/* Rules */}
        <button
          id="ondice-btn-rules"
          onClick={onOpenRules}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          title="Xem luật chơi và thứ tự xếp hạng"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          id="ondice-btn-sound"
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
        </button>
      </div>
    </header>
  );
};
