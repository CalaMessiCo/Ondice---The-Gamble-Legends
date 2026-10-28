import React, { useState } from 'react';
import { X, Gamepad2, Gem, Dices, RotateCcw, Trophy, Lock } from 'lucide-react';
import { UserProfile } from '../types/ondice';
import { Dice3D } from './Dice3D';
import { sound } from '../utils/audio';

interface MinigamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onRewardDiamonds: (amount: number) => void;
  onOpenShop: () => void;
}

export const MinigamesModal: React.FC<MinigamesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRewardDiamonds,
  onOpenShop,
}) => {
  const [activeGame, setActiveGame] = useState<'reverse' | 'sum'>('reverse');

  // Minigame 1: Đảo Ngược state
  const [reverseDicePlayer, setReverseDicePlayer] = useState<[number, number, number, number]>([1, 2, 1, 3]);
  const [reverseDiceOpponent, setReverseDiceOpponent] = useState<[number, number, number, number]>([4, 5, 2, 6]);
  const [reverseRolling, setReverseRolling] = useState(false);
  const [reverseResult, setReverseResult] = useState<string | null>(null);

  // Minigame 2: Cộng Dồn state
  const [sumRound, setSumRound] = useState<number>(1);
  const [sumPlayerScore, setSumPlayerScore] = useState<number>(0);
  const [sumOpponentScore, setSumOpponentScore] = useState<number>(0);
  const [sumDice, setSumDice] = useState<[number, number, number, number]>([3, 4, 5, 2]);
  const [sumRolling, setSumRolling] = useState(false);
  const [sumGameOver, setSumGameOver] = useState(false);

  if (!isOpen) return null;

  // Handler for Ondice Đảo Ngược
  const playReverseGame = () => {
    if (reverseRolling) return;
    setReverseRolling(true);
    sound.playRoll();

    setTimeout(() => {
      const pDice: [number, number, number, number] = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      const oDice: [number, number, number, number] = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];

      setReverseDicePlayer(pDice);
      setReverseDiceOpponent(oDice);
      setReverseRolling(false);

      // In Reverse: Min sum or lowest single is best!
      const pMin = Math.min(...pDice);
      const oMin = Math.min(...oDice);

      if (pMin < oMin) {
        setReverseResult('🎉 BẠN CHIẾN THẮNG! (Có số nhỏ hơn đối thủ: ' + pMin + ' vs ' + oMin + ') +1 KC');
        sound.playWinRound();
        onRewardDiamonds(1);
      } else if (pMin > oMin) {
        setReverseResult('❌ ĐỐI THỦ THẮNG! (Đối thủ có số nhỏ hơn: ' + oMin + ' vs ' + pMin + ')');
        sound.playPass();
      } else {
        // Compare total sum (lowest wins)
        const pSum = pDice.reduce((a, b) => a + b, 0);
        const oSum = oDice.reduce((a, b) => a + b, 0);
        if (pSum < oSum) {
          setReverseResult('🎉 BẠN CHIẾN THẮNG! (Tổng điểm nhỏ hơn: ' + pSum + ' vs ' + oSum + ') +1 KC');
          sound.playWinRound();
          onRewardDiamonds(1);
        } else if (pSum > oSum) {
          setReverseResult('❌ ĐỐI THỦ THẮNG! (Tổng điểm đối thủ nhỏ hơn: ' + oSum + ' vs ' + pSum + ')');
          sound.playPass();
        } else {
          setReverseResult('⚖️ HÒA NHAU! Cả hai bên đều có tổ hợp tương đương.');
        }
      }
    }, 900);
  };

  // Handler for Ondice Cộng Dồn
  const playSumRoll = () => {
    if (sumRolling || sumGameOver) return;
    setSumRolling(true);
    sound.playRoll();

    setTimeout(() => {
      const pDice: [number, number, number, number] = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      const pGain = pDice.reduce((a, b) => a + b, 0);
      const oGain = Math.floor(Math.random() * 15) + 9; // Opponent rolls between 10 and 24

      setSumDice(pDice);
      setSumPlayerScore((prev) => prev + pGain);
      setSumOpponentScore((prev) => prev + oGain);
      setSumRolling(false);

      if (sumRound >= 3) {
        setSumGameOver(true);
        const finalP = sumPlayerScore + pGain;
        const finalO = sumOpponentScore + oGain;
        if (finalP > finalO) {
          sound.playVictory();
          onRewardDiamonds(2);
        } else {
          sound.playPass();
        }
      } else {
        setSumRound((prev) => prev + 1);
        sound.playSelect();
      }
    }, 850);
  };

  const resetSumGame = () => {
    setSumRound(1);
    setSumPlayerScore(0);
    setSumOpponentScore(0);
    setSumGameOver(false);
  };

  const isReverseUnlocked = profile.unlockedMinigameReverse;
  const isSumUnlocked = profile.unlockedMinigameSum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/20 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Các Minigames Ondice Đặc Biệt
              </h2>
              <p className="text-xs text-white/60">
                Thử thách gieo xúc xắc với luật chơi mới lạ & săn thưởng Kim Cương
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

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveGame('reverse')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeGame === 'reverse'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>🔄 Ondice Đảo Ngược</span>
            {!isReverseUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
          </button>

          <button
            onClick={() => setActiveGame('sum')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeGame === 'sum'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>➕ Ondice Cộng Dồn</span>
            {!isSumUnlocked && <Lock className="w-3 h-3 text-amber-400" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
          {activeGame === 'reverse' ? (
            !isReverseUnlocked ? (
              <div className="p-8 flex flex-col items-center gap-3">
                <Lock className="w-12 h-12 text-cyan-400" />
                <h3 className="text-base font-bold">Minigame Ondice Đảo Ngược Đang Khóa</h3>
                <p className="text-xs text-white/70 max-w-sm">
                  Gieo số càng nhỏ càng mạnh! Mở khóa với <strong>8 Kim Cương</strong> tại Cửa Hàng.
                </p>
                <button
                  onClick={onOpenShop}
                  className="mt-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs flex items-center gap-1.5"
                >
                  <Gem className="w-3.5 h-3.5" />
                  Mở Khóa Trong Cửa Hàng (8 KC)
                </button>
              </div>
            ) : (
              /* Play Reverse Game */
              <div className="w-full max-w-md space-y-4">
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 text-xs text-cyan-200">
                  🎯 <strong>Quy tắc:</strong> Ai gieo ra số nhỏ nhất sẽ chiến thắng! (Số 1 đơn là mạnh nhất).
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-white/70 block mb-1 font-bold">Xúc xắc của Bạn:</span>
                  <Dice3D values={reverseDicePlayer} isRolling={reverseRolling} />
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-white/70 block mb-1 font-bold">Xúc xắc Đối thủ:</span>
                  <Dice3D values={reverseDiceOpponent} isRolling={reverseRolling} />
                </div>

                {reverseResult && (
                  <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
                    {reverseResult}
                  </div>
                )}

                <button
                  disabled={reverseRolling}
                  onClick={playReverseGame}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  {reverseRolling ? 'Đang Gieo...' : 'GIEO XÚC XẮC ĐẢO NGƯỢC'}
                </button>
              </div>
            )
          ) : (
            !isSumUnlocked ? (
              <div className="p-8 flex flex-col items-center gap-3">
                <Lock className="w-12 h-12 text-amber-400" />
                <h3 className="text-base font-bold">Minigame Ondice Cộng Dồn Đang Khóa</h3>
                <p className="text-xs text-white/70 max-w-sm">
                  Cộng dồn điểm qua 3 hiệp đấu! Mở khóa với <strong>8 Kim Cương</strong> tại Cửa Hàng.
                </p>
                <button
                  onClick={onOpenShop}
                  className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5"
                >
                  <Gem className="w-3.5 h-3.5 fill-neutral-950" />
                  Mở Khóa Trong Cửa Hàng (8 KC)
                </button>
              </div>
            ) : (
              /* Play Sum Game */
              <div className="w-full max-w-md space-y-4">
                <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-400/30 text-xs text-amber-200">
                  🎯 <strong>Quy tắc:</strong> Gieo 3 hiệp. Tổng điểm 4 viên xúc xắc cao hơn sẽ chiến thắng +2 Kim Cương!
                </div>

                <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10">
                  <div className="text-left">
                    <span className="text-xs text-white/60 block">Điểm Của Bạn:</span>
                    <span className="text-xl font-black text-amber-300">{sumPlayerScore}</span>
                  </div>
                  <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-xl">
                    Hiệp {sumRound} / 3
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-white/60 block">Điểm Đối Thủ:</span>
                    <span className="text-xl font-black text-red-300">{sumOpponentScore}</span>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                  <Dice3D values={sumDice} isRolling={sumRolling} />
                </div>

                {sumGameOver ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400 text-center space-y-2">
                    <h4 className="text-base font-black text-amber-300">
                      {sumPlayerScore > sumOpponentScore
                        ? '🎉 BẠN THẮNG CUỘC ĐUA TỔNG ĐIỂM! (+2 KC)'
                        : sumPlayerScore < sumOpponentScore
                        ? '❌ BẠN ĐÃ THUA CUỘC ĐUA TỔNG ĐIỂM!'
                        : '⚖️ HÒA NHAU!'}
                    </h4>
                    <button
                      onClick={resetSumGame}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl"
                    >
                      CHƠI LẠI TRẬN MỚI
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={sumRolling}
                    onClick={playSumRoll}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-neutral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    {sumRolling ? 'Đang Tính Điểm...' : `GIEO XÚC XẮC HIỆP ${sumRound}`}
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
