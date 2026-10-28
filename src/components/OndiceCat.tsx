import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, X, Volume2, Flame, Trophy, Shield, HelpCircle } from 'lucide-react';
import ondiceCatImg from '../assets/images/ondice_cat_mascot_1790074118799.jpg';
import { sound } from '../utils/audio';

export interface MascotEvent {
  id: string;
  type: 'quad' | 'triple' | 'counter' | 'shield' | 'win_round' | 'win_match' | 'pass' | 'custom';
  message: string;
  mood?: 'excited' | 'cheering' | 'playful' | 'surprised' | 'comforting';
}

interface OndiceCatProps {
  currentEvent: MascotEvent | null;
  onClearEvent?: () => void;
  soundEnabled?: boolean;
}

const CAT_TIPS = [
  'Meow! Ondice Cat chúc bạn gieo được tứ 6 bất bại!',
  'Mẹo mèo: Khi có Đôi Hai, nhớ lấy số lớn nhất làm số tối đại meow!',
  'Bị ép bài quá cao? Đừng ngại bấm "Bỏ Lượt", giữ sức vòng sau!',
  'Purrrr... Vuốt ve Ondice Cat 1 cái để tăng 99% tỉ lệ ra Tam Quý nè! 🐾',
  'Gặp bài trùng trên bàn? Cơ hội "Phản Công Bốc Lửa" đang chờ bạn đấy!',
  'Mèo đen Ondice mang lại vận may chiến thuật! Tự tin tung xúc xắc nào!',
  'Bạn có biết? Trong Ondice, Tứ 1 vẫn hạ gục được Đôi Hai tối đại 6 đó meow!',
  'Ondice Cat thích nhất những cú lội ngược dòng lật kèo ngoạn mục!',
  'Nước đi 4 số liên tiếp (1~4, 2~5, 3~6) uy lực hơn cả 3 số liên tiếp đó!',
  'Gặp khó khăn thì hãy nhớ trang bị Khiên Hộ Mệnh trong Cửa Hàng meow~',
];

const CAT_FORTUNES = [
  '🔮 Quẻ bói mèo: Lượt sau của bạn tỏa sáng rực rỡ, khả năng cao ra số to!',
  '🔮 Quẻ bói mèo: Đôi hoặc Tam đang trên đường tới tay bạn!',
  '🔮 Quẻ bói mèo: Giữ bình tĩnh, một pha lật kèo sắp xảy ra meow!',
  '🔮 Quẻ bói mèo: Vận may đang ở đỉnh cao, hãy mạnh dạn gieo ngay!',
];

export const OndiceCat: React.FC<OndiceCatProps> = ({
  currentEvent,
  onClearEvent,
  soundEnabled = true,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [mood, setMood] = useState<'excited' | 'cheering' | 'playful' | 'surprised' | 'comforting'>('playful');
  const [isBouncing, setIsBouncing] = useState(false);
  const [purrCount, setPurrCount] = useState(0);

  // React to game events automatically
  useEffect(() => {
    if (!currentEvent) return;

    setActiveSpeech(currentEvent.message);
    setMood(currentEvent.mood || 'excited');
    setIsBouncing(true);

    if (soundEnabled) {
      sound.playMeow();
    }

    const timer = setTimeout(() => {
      setIsBouncing(false);
    }, 1200);

    // Auto dismiss after 6 seconds if no manual click
    const dismissTimer = setTimeout(() => {
      setActiveSpeech((prev) => (prev === currentEvent.message ? null : prev));
      if (onClearEvent) onClearEvent();
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [currentEvent, soundEnabled, onClearEvent]);

  // Handle clicking directly on the cat
  const handlePetCat = () => {
    if (soundEnabled) {
      sound.playMeow();
    }
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 800);

    setPurrCount((c) => c + 1);
    const randomTip = CAT_TIPS[Math.floor(Math.random() * CAT_TIPS.length)];
    setActiveSpeech(randomTip);
    setMood('playful');
  };

  const handleAskFortune = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) sound.playSelect();
    const fortune = CAT_FORTUNES[Math.floor(Math.random() * CAT_FORTUNES.length)];
    setActiveSpeech(fortune);
    setMood('cheering');
  };

  const getMoodBadge = () => {
    switch (mood) {
      case 'excited':
        return { label: 'Phấn Khích!', bg: 'bg-amber-500 text-neutral-950', icon: <Sparkles className="w-3 h-3" /> };
      case 'cheering':
        return { label: 'Cổ Vũ!', bg: 'bg-emerald-500 text-white', icon: <Trophy className="w-3 h-3" /> };
      case 'surprised':
        return { label: 'Bất Ngờ!', bg: 'bg-red-500 text-white', icon: <Flame className="w-3 h-3" /> };
      case 'comforting':
        return { label: 'An Ủi', bg: 'bg-blue-500 text-white', icon: <Shield className="w-3 h-3" /> };
      case 'playful':
      default:
        return { label: 'Vui Vẻ', bg: 'bg-purple-500 text-white', icon: <span className="text-xs">🐾</span> };
    }
  };

  const badge = getMoodBadge();

  return (
    <div className="fixed bottom-4 right-3 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-2 max-w-[280px] sm:max-w-xs bg-neutral-950/95 border-2 border-amber-400 text-white rounded-2xl p-3 shadow-2xl backdrop-blur-md pointer-events-auto relative"
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300 font-['Outfit',sans-serif] tracking-wide">
                  🐾 ONDICE CAT
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${badge.bg}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>
              <button
                onClick={() => setActiveSpeech(null)}
                className="text-white/50 hover:text-white transition-colors p-0.5"
                title="Đóng lời thoại"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content message */}
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {activeSpeech}
            </p>

            {/* Quick Interactive Actions */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleAskFortune}
                className="text-[10px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-lg transition-all flex items-center gap-1"
              >
                <span>🔮 Xin Quẻ Mèo</span>
              </button>
              <span className="text-[10px] text-white/40 italic">
                Bấm vào mèo để trò chuyện
              </span>
            </div>

            {/* Speech bubble tail pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-neutral-950 border-r-2 border-b-2 border-amber-400 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Card */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {isOpen ? (
          <motion.div
            onClick={handlePetCat}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            animate={isBouncing ? { y: [0, -14, 0, -8, 0], rotate: [0, -4, 4, -2, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="group relative cursor-pointer flex items-center gap-2.5 bg-neutral-900/90 hover:bg-neutral-800/95 border-2 border-amber-400/80 hover:border-amber-300 rounded-full p-1.5 pr-3 shadow-xl backdrop-blur-md transition-all"
            title="Ondice Cat - Linh vật may mắn! Bấm để vuốt ve hoặc nghe mẹo."
          >
            {/* Mascot Image Container with Animated Glow */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-neutral-950 shadow-inner flex items-center justify-center">
              <img
                src={ondiceCatImg}
                alt="Ondice Cat - Linh vật mèo đen Ondice"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {/* Little sparkler dot */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75" />
            </div>

            {/* Mascot Name & Status */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-amber-300 font-['Outfit',sans-serif] tracking-wider">
                  Ondice Cat
                </span>
                <span className="text-[10px]">🐾</span>
              </div>
              <span className="text-[10px] text-white/60 group-hover:text-amber-200 transition-colors font-medium">
                {purrCount > 0 ? `Đã vuốt ve: ${purrCount}` : 'Linh vật may mắn'}
              </span>
            </div>

            {/* Minimize / Hide button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="ml-1 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title="Thu nhỏ Ondice Cat"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          /* Minimized Paw Button */
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              handlePetCat();
            }}
            className="w-11 h-11 rounded-full bg-neutral-900/95 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-lg hover:border-amber-300 transition-all cursor-pointer relative"
            title="Gọi linh vật Ondice Cat"
          >
            <span className="text-lg">🐾</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse border border-neutral-900" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
