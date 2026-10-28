import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Shield, 
  Zap, 
  RotateCcw, 
  ChevronRight, 
  Trophy, 
  AlertCircle, 
  Check, 
  Bot, 
  User, 
  Eye, 
  Dices,
  Flag,
  Sparkles
} from 'lucide-react';
import { OndiceChoice, Player, MatchLength, GameMode, TierType } from '../types/ondice';
import { Dice3D } from './Dice3D';

interface GameTableProps {
  players: Player[];
  currentTurnIndex: number;
  currentDice: [number, number, number, number];
  isRolling: boolean;
  hasRolledThisTurn: boolean;
  availableChoices: OndiceChoice[];
  selectedChoice: OndiceChoice | null;
  tableChoice: OndiceChoice | null;
  tableLastPlayerId: string | null;
  isCounterAttack: boolean;
  lastActionMessage: string;
  roundNumber: number;
  matchLength: MatchLength;
  mode: GameMode;
  tier: TierType;
  winner: Player | null;
  onRollDice: () => void;
  onSelectChoice: (choice: OndiceChoice) => void;
  onPlayChoice: () => void;
  onPass: () => void;
  onUseShield: () => void;
  onUsePotion?: (potionType: string) => void;
  onRestartMatch: () => void;
  userPlayerId: string;
}

export const GameTable: React.FC<GameTableProps> = ({
  players,
  currentTurnIndex,
  currentDice,
  isRolling,
  hasRolledThisTurn,
  availableChoices,
  selectedChoice,
  tableChoice,
  tableLastPlayerId,
  isCounterAttack,
  lastActionMessage,
  roundNumber,
  matchLength,
  mode,
  tier,
  winner,
  onRollDice,
  onSelectChoice,
  onPlayChoice,
  onPass,
  onUseShield,
  onRestartMatch,
  userPlayerId,
}) => {
  const currentPlayer = players[currentTurnIndex] || players[0];
  // In PvP mode, every player is a real human playing on their turn; in AI mode, only userPlayerId controls their turn
  const isUserTurn = mode === 'pvp' ? true : (currentPlayer?.id === userPlayerId);
  const lastPlayer = players.find((p) => p.id === tableLastPlayerId);
  const activeTurnPlayer = mode === 'pvp' ? currentPlayer : players.find((p) => p.id === userPlayerId);

  // Check if current user has any valid or counter-attack choice
  const canPlaySelected = Boolean(
    selectedChoice &&
    (!tableChoice ||
      selectedChoice.rank > tableChoice.rank ||
      selectedChoice.rank === tableChoice.rank)
  );

  const isSelectedCounterAttack = Boolean(
    selectedChoice && tableChoice && selectedChoice.rank === tableChoice.rank
  );

  const canUseShield = Boolean(
    isUserTurn &&
    hasRolledThisTurn &&
    activeTurnPlayer?.hasShield &&
    !activeTurnPlayer?.shieldUsedInRound
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 flex flex-col gap-4">
      {/* Top Match Info Bar */}
      <div className="flex items-center justify-between bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl text-xs font-bold">
            <span className="text-amber-300">Vòng {roundNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <span>Mục tiêu:</span>
            <span className="font-extrabold text-amber-400">{matchLength} Tọa Điểm</span>
            <span className="text-[10px] text-white/50">
              ({matchLength === 5 ? 'Bản Ngắn' : matchLength === 10 ? 'Bản Vừa' : 'Bản Lâu'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-xl">
            {mode === 'ai' ? (
              <>
                <Bot className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-white font-medium">Đấu Máy (AI)</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-white font-medium">Đấu Người Thật</span>
              </>
            )}
          </div>
          <div className="text-xs text-white/70 hidden sm:block">
            {players.length} người chơi
          </div>
        </div>
      </div>

      {/* Players Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {players.map((p, idx) => {
          const isTurn = idx === currentTurnIndex;
          const isLastWinner = p.id === tableLastPlayerId;

          return (
            <div
              key={p.id}
              className={`relative p-2.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isTurn
                  ? 'bg-gradient-to-b from-amber-500/30 to-orange-600/30 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 -translate-y-1'
                  : p.passedThisRound
                  ? 'bg-black/40 border-white/5 opacity-50'
                  : 'bg-black/20 border-white/10'
              }`}
            >
              {/* Turn Indicator Pill */}
              {isTurn && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-neutral-950 font-black text-[9px] px-2 py-0.2 rounded-full uppercase tracking-wider shadow">
                  Đang Gieo
                </div>
              )}

              <div className="flex items-center gap-2 mb-1.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shadow">
                    {p.avatar}
                  </div>
                  {p.hasShield && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow"
                      title="Có Khiên phòng thủ"
                    >
                      <Shield className="w-2.5 h-2.5 fill-blue-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    {p.isAI && <Bot className="w-3 h-3 text-cyan-300 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] text-white/60">
                    {p.id === userPlayerId ? '(Bạn)' : p.isHost ? '(Host)' : ''}
                  </p>
                </div>
              </div>

              {/* Seat Points (Tọa Điểm) */}
              <div className="flex items-center justify-between bg-black/30 px-2 py-1 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/70 font-medium">Tọa Điểm:</span>
                <span className="text-xs font-black text-amber-300">
                  {p.seatPoints} / {matchLength}
                </span>
              </div>

              {/* Status / Passed */}
              {p.passedThisRound && (
                <span className="text-[9px] text-red-300 font-bold mt-1 text-center bg-red-950/40 rounded py-0.5 border border-red-500/20">
                  Đã Bỏ Lượt
                </span>
              )}

              {isLastWinner && tableChoice && !p.passedThisRound && (
                <span className="text-[9px] text-emerald-300 font-bold mt-1 text-center bg-emerald-950/40 rounded py-0.5 border border-emerald-500/20 truncate">
                  Đang Dẫn Đầu
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Table Arena */}
      <div className="relative bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Counter Attack fiery atmospheric sweep */}
        {isCounterAttack && (
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-orange-600/15 to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Current Table Choice Display */}
        <div className="flex flex-col items-center justify-center text-center mb-5 pb-5 border-b border-white/10">
          <span className="text-[11px] uppercase tracking-widest text-white/60 font-semibold mb-1">
            Lựa chọn hiện tại trên bàn
          </span>

          {tableChoice ? (
            <motion.div
              key={tableChoice.name + (tableLastPlayerId || '')}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-2xl border shadow-xl ${
                isCounterAttack
                  ? 'bg-gradient-to-r from-red-950/80 via-orange-950/80 to-amber-950/80 border-red-500 ring-2 ring-red-500/40'
                  : 'bg-white/10 border-white/25'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCounterAttack && <Flame className="w-5 h-5 text-red-500 fill-amber-400 animate-bounce" />}
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-['Outfit',sans-serif]">
                  {tableChoice.name}
                </span>
                <span className="text-xs font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  Hạng {tableChoice.rank}/36
                </span>
              </div>
              <span className="text-xs text-white/80">
                Người đặt: <strong className="text-white">{lastPlayer?.name || 'Vô danh'}</strong>
                {isCounterAttack && (
                  <span className="ml-1.5 text-red-400 font-black tracking-wide">
                    (VỪA BỊ PHẢN CÔNG BỐC LỬA!)
                  </span>
                )}
              </span>
            </motion.div>
          ) : (
            <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/70 text-xs sm:text-sm">
              ✨ Bàn chơi đang trống — Người gieo có thể chọn bất kỳ tổ hợp nào để mở đầu!
            </div>
          )}
        </div>

        {/* 4 Dice Center Display */}
        <div className="flex flex-col items-center justify-center my-2">
          <Dice3D
            values={currentDice}
            isRolling={isRolling}
            isCounterAttack={isCounterAttack}
            selectedIndices={selectedChoice?.diceIndices || []}
          />

          {/* Action Log message */}
          <div className="mt-3 text-center min-h-[22px]">
            <p className="text-xs sm:text-sm font-semibold text-white/90 drop-shadow">
              {lastActionMessage}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-4">
          {/* Turn notification banner for PvP */}
          {mode === 'pvp' && (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Lượt Đấu: <strong className="text-white text-sm ml-1 font-black underline decoration-emerald-400">{currentPlayer?.name}</strong> (Người Thật)
                </span>
              </div>
              <span className="text-[11px] text-emerald-300/80 hidden sm:inline font-medium">
                {hasRolledThisTurn ? 'Hãy chọn 1 tổ hợp để ra bài hoặc bỏ cuộc' : 'Hãy bấm nút gieo 4 xúc xắc bên dưới'}
              </span>
            </div>
          )}

          {/* If it's user's turn */}
          {isUserTurn ? (
            <div className="flex flex-col items-center gap-3">
              {/* If user hasn't rolled yet */}
              {!hasRolledThisTurn ? (
                <div className="flex items-center gap-3">
                  <motion.button
                    id="ondice-btn-roll"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRolling}
                    onClick={onRollDice}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-neutral-950 text-base font-black rounded-2xl shadow-xl shadow-amber-500/30 transition-all border border-amber-300"
                  >
                    <Dices className="w-5 h-5 fill-neutral-950" />
                    <span>
                      {mode === 'pvp' ? `GIEO 4 XÚC XẮC (${currentPlayer?.name})` : 'GIEO 4 XÚC XẮC'}
                    </span>
                  </motion.button>
                </div>
              ) : (
                /* User has rolled! Show generated choices list */
                <div className="w-full flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Lựa chọn từ 4 xúc xắc ({availableChoices.length} tổ hợp):
                    </span>
                    <span className="text-[11px] text-white/60">
                      Chọn 1 tổ hợp lớn hơn hiện tại hoặc giống để phản công
                    </span>
                  </div>

                  {/* Choice chips */}
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 rounded-xl bg-black/20 border border-white/10">
                    {availableChoices.map((choice) => {
                      const isSelected = selectedChoice?.id === choice.id;
                      const isCounter = Boolean(tableChoice && choice.rank === tableChoice.rank);
                      const isHigher = Boolean(!tableChoice || choice.rank > tableChoice.rank);
                      const isLower = Boolean(tableChoice && choice.rank < tableChoice.rank);

                      return (
                        <button
                          key={choice.id}
                          id={`ondice-choice-${choice.id}`}
                          disabled={isLower}
                          onClick={() => onSelectChoice(choice)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left ${
                            isSelected
                              ? isCounter
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-amber-300 shadow-lg shadow-red-600/40 ring-2 ring-amber-400 scale-105'
                                : 'bg-amber-400 text-neutral-950 border-amber-200 shadow-md ring-2 ring-amber-300 scale-105'
                              : isCounter
                              ? 'bg-red-950/70 text-red-200 border-red-500/60 hover:bg-red-900/80 hover:border-red-400'
                              : isHigher
                              ? 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/40'
                              : 'bg-black/30 text-white/30 border-white/5 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              {isCounter && <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />}
                              <span className="text-sm font-extrabold">{choice.name}</span>
                            </div>
                            <span className="text-[10px] opacity-80">
                              Hạng {choice.rank} • {choice.description}
                            </span>
                          </div>

                          {isCounter && (
                            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase shadow">
                              Phản Công
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {availableChoices.length === 0 && (
                      <div className="w-full py-4 text-center text-xs text-white/60">
                        Không tìm thấy lựa chọn hợp lệ từ xúc xắc.
                      </div>
                    )}
                  </div>

                  {/* Actions buttons: Play Choice, Pass, Shield */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    {/* Play Choice Button */}
                    <button
                      id="ondice-btn-play-choice"
                      disabled={!canPlaySelected}
                      onClick={onPlayChoice}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm shadow-lg transition-all ${
                        canPlaySelected
                          ? isSelectedCounterAttack
                            ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-500/40 ring-2 ring-amber-300 animate-pulse scale-105'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/30 hover:scale-105'
                          : 'bg-neutral-800 text-white/40 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      {isSelectedCounterAttack ? (
                        <>
                          <Flame className="w-4 h-4 fill-amber-200" />
                          <span>KÍCH HOẠT PHẢN CÔNG! ({selectedChoice?.name})</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>
                            {selectedChoice ? `ĐÁNH "${selectedChoice.name.toUpperCase()}"` : 'CHỌN 1 TỔ HỢP'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Shield Re-roll Button */}
                    {canUseShield && (
                      <button
                        id="ondice-btn-use-shield"
                        onClick={onUseShield}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 border border-blue-400"
                        title="Dùng Khiên để gieo lại 1 lần khi không có nước đi tốt"
                      >
                        <Shield className="w-4 h-4 fill-blue-200" />
                        <span>Dùng Khiên (Gieo Lại)</span>
                      </button>
                    )}

                    {/* Pass Button */}
                    <button
                      id="ondice-btn-pass"
                      onClick={onPass}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-colors border border-red-400/40"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{mode === 'pvp' ? `Bỏ Cuộc (${currentPlayer?.name})` : 'Bỏ Cuộc (Pass Vòng)'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Other player or AI is thinking */
            <div className="flex flex-col items-center justify-center py-3 gap-2">
              <div className="flex items-center gap-2 text-white/90 text-sm font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>
                  Đang đợi <strong>{currentPlayer?.name}</strong> {isRolling ? 'gieo xúc xắc...' : 'suy nghĩ nước đi...'}
                </span>
              </div>
              <p className="text-xs text-white/60">
                Hãy quan sát chiến thuật và phản công khi đến lượt của bạn!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Match Victory Dialog */}
      <AnimatePresence>
        {winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-amber-400 rounded-3xl p-6 text-center text-white shadow-2xl shadow-amber-500/20"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce">
                <Trophy className="w-8 h-8 text-neutral-950" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 font-['Outfit',sans-serif]">
                CHIẾN THẮNG TRẬN ĐẤU!
              </h2>

              <p className="text-base text-white/90 font-bold mt-2">
                Người chiến thắng: <span className="text-amber-400">{winner.name}</span>
              </p>

              <p className="text-xs text-white/70 mt-1">
                Đã đạt mục tiêu <strong>{matchLength} Tọa Điểm</strong> xuất sắc!
              </p>

              {winner.id === userPlayerId && (
                <div className="mt-4 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-xs text-amber-200 font-semibold">
                  🎁 Thưởng chiến thắng: +2 Kim Cương vào ví của bạn!
                </div>
              )}

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  id="ondice-btn-restart-match"
                  onClick={onRestartMatch}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-neutral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  CHƠI TRẬN MỚI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
