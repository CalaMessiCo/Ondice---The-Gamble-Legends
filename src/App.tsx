import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  TierType, 
  GameMode, 
  MatchLength, 
  Player, 
  OndiceChoice, 
  UserProfile, 
  PRIZE_COMBINATIONS 
} from './types/ondice';
import { evaluateRoll, getPlayableChoices } from './utils/evaluator';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { GameTable } from './components/GameTable';
import { VoiceChatBar } from './components/VoiceChatBar';
import { ShopModal } from './components/ShopModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { RulesModal } from './components/RulesModal';
import { MinigamesModal } from './components/MinigamesModal';
import { LobbyModal } from './components/LobbyModal';
import { OndiceCat, MascotEvent } from './components/OndiceCat';

const USER_ID = 'player_1';

const INITIAL_PROFILE: UserProfile = {
  diamonds: 0,
  tier: 'free',
  vipExpiresAt: null,
  ownedShield: false,
  ownedDoublePoint: false,
  unlockedLeaderboard: false,
  unlockedMinigameReverse: false,
  unlockedMinigameSum: false,
  potions: {
    lucky: 1,
    reroll: 1,
    hellfire: 1,
    insight: 1,
  },
  achievements: {},
  totalSeatPoints: 12,
  matchesWon: 2,
};

export default function App() {
  // Load profile from localStorage if exists
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ondice_profile_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          tier: 'free',
          vipExpiresAt: null,
        };
      }
    } catch {}
    return INITIAL_PROFILE;
  });

  // Save profile changes
  useEffect(() => {
    try {
      localStorage.setItem('ondice_profile_v2', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Match Configuration & State (Default to Free / Cam)
  const [tier, setTier] = useState<TierType>('free');

  // Enforce Free tier on mount
  useEffect(() => {
    if (profile.tier !== 'free') {
      setProfile((prev) => ({ ...prev, tier: 'free', vipExpiresAt: null }));
    }
    setTier('free');
    setPlayers((prev) =>
      prev.map((p) => (p.id === USER_ID ? { ...p, tier: 'free' } : p))
    );
  }, []);
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [matchLength, setMatchLength] = useState<MatchLength>(5);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modal States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMinigamesOpen, setIsMinigamesOpen] = useState(false);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);

  // Active Players State
  const [players, setPlayers] = useState<Player[]>([
    {
      id: USER_ID,
      name: 'Bạn',
      avatar: '🎲',
      isAI: false,
      seatPoints: 0,
      hasShield: profile.ownedShield,
      shieldUsedInRound: false,
      hasDoublePoint: profile.ownedDoublePoint,
      isHost: true,
      tier: profile.tier,
      passedThisRound: false,
    },
    {
      id: 'ai_1',
      name: 'Cao Thủ AI',
      avatar: '🤖',
      isAI: true,
      seatPoints: 0,
      hasShield: false,
      shieldUsedInRound: false,
      hasDoublePoint: false,
      tier: 'free',
      passedThisRound: false,
    },
  ]);

  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [currentDice, setCurrentDice] = useState<[number, number, number, number]>([1, 2, 5, 2]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState<boolean>(false);
  const [availableChoices, setAvailableChoices] = useState<OndiceChoice[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<OndiceChoice | null>(null);
  const [tableChoice, setTableChoice] = useState<OndiceChoice | null>(null);
  const [tableLastPlayerId, setTableLastPlayerId] = useState<string | null>(null);
  const [isCounterAttack, setIsCounterAttack] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string>(
    'Chào mừng đến với Ondice! Hãy gieo 4 xúc xắc để bắt đầu vòng 1.'
  );
  const [winner, setWinner] = useState<Player | null>(null);

  // Mascot Ondice Cat Event State
  const [mascotEvent, setMascotEvent] = useState<MascotEvent | null>(null);

  const triggerMascot = useCallback((event: Omit<MascotEvent, 'id'>) => {
    setMascotEvent({
      id: `${Date.now()}-${Math.random()}`,
      ...event,
    });
  }, []);

  // Initial Ondice Cat welcome
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMascot({
        type: 'custom',
        message: 'Meow! Chào mừng bạn đến với Ondice! Tớ là Ondice Cat, linh vật may mắn đồng hành cùng bạn!',
        mood: 'playful',
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [triggerMascot]);

  // Keep sound setting synced
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Keep user equipment synced with profile
  useEffect(() => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === USER_ID
          ? {
              ...p,
              tier,
              hasShield: profile.ownedShield,
              hasDoublePoint: profile.ownedDoublePoint,
            }
          : p
      )
    );
  }, [profile.ownedShield, profile.ownedDoublePoint, tier]);

  // Handle Turn Progression
  const getNextActivePlayerIndex = useCallback(
    (startIndex: number, playerList: Player[]): number => {
      let count = 0;
      let nextIdx = (startIndex + 1) % playerList.length;
      while (playerList[nextIdx].passedThisRound && count < playerList.length) {
        nextIdx = (nextIdx + 1) % playerList.length;
        count++;
      }
      return nextIdx;
    },
    []
  );

  // Check if round should end (all players except tableLastPlayer passed)
  const checkRoundEnd = useCallback(
    (playerList: Player[], lastWinnerId: string | null) => {
      if (!lastWinnerId) return false;
      const activePlayers = playerList.filter((p) => !p.passedThisRound);
      return activePlayers.length <= 1;
    },
    []
  );

  // Resolve Round Victory
  const resolveRound = useCallback(
    (winningPlayerId: string, currentPlayers: Player[]) => {
      const winnerPlayer = currentPlayers.find((p) => p.id === winningPlayerId);
      if (!winnerPlayer) return;

      // Calculate point gain (Check Double Point effect: 50% chance for 2 points)
      let pointsGained = 1;
      let doubleNotice = '';
      if (winnerPlayer.hasDoublePoint && Math.random() < 0.5) {
        pointsGained = 2;
        doubleNotice = ' ⚡️ Kích hoạt Nhân Đôi: +2 Tọa Điểm!';
      }

      const updatedPlayers = currentPlayers.map((p) => {
        if (p.id === winningPlayerId) {
          return {
            ...p,
            seatPoints: p.seatPoints + pointsGained,
            passedThisRound: false,
            shieldUsedInRound: false,
          };
        }
        return {
          ...p,
          passedThisRound: false,
          shieldUsedInRound: false,
        };
      });

      setPlayers(updatedPlayers);
      sound.playWinRound();

      const newPoints = winnerPlayer.seatPoints + pointsGained;
      setLastActionMessage(
        `🎉 ${winnerPlayer.name} thắng vòng và nhận +${pointsGained} Tọa Điểm!${doubleNotice}`
      );

      // Check Match Victory Condition
      if (newPoints >= matchLength) {
        setWinner(winnerPlayer);
        sound.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

        triggerMascot({
          type: 'win_match',
          message: `🏆 MEOWWW! ${winnerPlayer.name} đã chạm mốc ${newPoints} Tọa Điểm và trở thành Nhà Vô Địch Ondice!`,
          mood: 'cheering',
        });

        // Update profile stats
        if (winnerPlayer.id === USER_ID) {
          setProfile((prev) => ({
            ...prev,
            diamonds: prev.diamonds + 2,
            totalSeatPoints: prev.totalSeatPoints + newPoints,
            matchesWon: prev.matchesWon + 1,
          }));
        }
        return;
      } else {
        triggerMascot({
          type: 'win_round',
          message: `🎉 +${pointsGained} Tọa Điểm! Chúc mừng ${winnerPlayer.name} đã làm chủ vòng đấu meow!`,
          mood: 'cheering',
        });
      }

      // Next Round
      setTimeout(() => {
        setTableChoice(null);
        setTableLastPlayerId(null);
        setIsCounterAttack(false);
        setHasRolledThisTurn(false);
        setSelectedChoice(null);
        setAvailableChoices([]);
        setRoundNumber((r) => r + 1);

        // Winner starts the new round
        const winnerIndex = updatedPlayers.findIndex((p) => p.id === winningPlayerId);
        setCurrentTurnIndex(winnerIndex !== -1 ? winnerIndex : 0);
        setLastActionMessage(
          `Vòng ${roundNumber + 1} bắt đầu! Bàn trống, ${winnerPlayer.name} hãy gieo xúc xắc mở đầu.`
        );
      }, 1800);
    },
    [matchLength, roundNumber]
  );

  // User Action: Roll Dice
  const handleRollDice = () => {
    if (isRolling || hasRolledThisTurn) return;
    const activePlayer = players[currentTurnIndex] || players[0];

    setIsRolling(true);
    sound.playRoll();

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const d3 = Math.floor(Math.random() * 6) + 1;
      const d4 = Math.floor(Math.random() * 6) + 1;
      const rolled: [number, number, number, number] = [d1, d2, d3, d4];

      setCurrentDice(rolled);
      setIsRolling(false);
      setHasRolledThisTurn(true);

      const choices = evaluateRoll(rolled);
      setAvailableChoices(choices);

      // Check and unlock prize achievements if rolled (tam or tu)
      if (activePlayer.id === USER_ID) {
        choices.forEach((c) => {
          if (c.type === 'triple' || c.type === 'quad') {
            const matchPrize = PRIZE_COMBINATIONS.find((p) => p.name === c.name);
            if (matchPrize && !profile.achievements[matchPrize.id]?.unlocked) {
              setProfile((prev) => ({
                ...prev,
                achievements: {
                  ...prev.achievements,
                  [matchPrize.id]: { unlocked: true, claimed: false },
                },
              }));
            }
          }
        });
      }

      // Filter against table choice
      const { playable, counterAttackChoices, higherChoices } = getPlayableChoices(
        choices,
        tableChoice
      );

      if (counterAttackChoices.length > 0) {
        setSelectedChoice(counterAttackChoices[0]);
        setLastActionMessage(
          `🔥 CƠ HỘI PHẢN CÔNG! ${activePlayer.name} vừa gieo được ${counterAttackChoices[0].name} (Trùng với bài trên bàn)!`
        );
      } else if (higherChoices.length > 0) {
        // Pre-select lowest winning choice
        setSelectedChoice(higherChoices[0]);
        setLastActionMessage(
          `${activePlayer.name} gieo được [${rolled.join(', ')}]. Đã tìm thấy ${higherChoices.length} lựa chọn lớn hơn!`
        );
      } else {
        setSelectedChoice(null);
        setLastActionMessage(
          `${activePlayer.name} gieo được [${rolled.join(', ')}]. Không có lựa chọn nào lớn hơn bài trên bàn!`
        );
      }

      // Ondice Cat Mascot Reactions to Rolls
      const quadChoice = choices.find((c) => c.type === 'quad');
      const straight4Choice = choices.find((c) => c.type === 'straight4');
      const tripleChoice = choices.find((c) => c.type === 'triple');

      if (quadChoice) {
        triggerMascot({
          type: 'quad',
          message: `MEOW MEOW! ${activePlayer.name} vừa gieo được ${quadChoice.name} cực phẩm! Nước đi tối thượng! 🐾✨`,
          mood: 'excited',
        });
      } else if (counterAttackChoices.length > 0) {
        triggerMascot({
          type: 'counter',
          message: `Xù lông! Phản công bốc lửa kìa meow! Trùng bài rồi, lật ngược thế cờ thôi! 🔥`,
          mood: 'surprised',
        });
      } else if (straight4Choice) {
        triggerMascot({
          type: 'custom',
          message: `4 số liên tiếp thẳng hàng! Bộ bài cực hiểm hóc meow! 🎲`,
          mood: 'excited',
        });
      } else if (tripleChoice) {
        triggerMascot({
          type: 'triple',
          message: `Tam hoa lấp lánh meow! Lực sát thương cực lớn! 🐾`,
          mood: 'cheering',
        });
      } else if (higherChoices.length === 0 && tableChoice) {
        triggerMascot({
          type: 'pass',
          message: `Không có lựa chọn lớn hơn rồi meow! Đừng nản lòng, có thể dùng Khiên hoặc đợi vòng sau! 🐾`,
          mood: 'comforting',
        });
      }
    }, 900);
  };

  // User Action: Play Choice
  const handlePlayChoice = () => {
    if (!selectedChoice) return;
    const activePlayer = players[currentTurnIndex] || players[0];
    const isCounter = tableChoice && selectedChoice.rank === tableChoice.rank;

    if (isCounter) {
      sound.playCounterAttack();
      setIsCounterAttack(true);
      setLastActionMessage(
        `🔥 PHẢN CÔNG RỰC LỬA! ${activePlayer.name} phản công bằng "${selectedChoice.name}", áp lực dồn lên người kế tiếp!`
      );
    } else {
      sound.playSelect();
      setIsCounterAttack(false);
      setLastActionMessage(
        `${activePlayer.name} vừa đánh "${selectedChoice.name}" (Hạng ${selectedChoice.rank}/36).`
      );
    }

    setTableChoice(selectedChoice);
    setTableLastPlayerId(activePlayer.id);
    setHasRolledThisTurn(false);
    setSelectedChoice(null);
    setAvailableChoices([]);

    // Check if next turn is needed
    const nextIdx = getNextActivePlayerIndex(currentTurnIndex, players);
    setCurrentTurnIndex(nextIdx);
  };

  // User Action: Pass
  const handlePass = () => {
    sound.playPass();
    const activePlayer = players[currentTurnIndex] || players[0];
    const updatedPlayers = players.map((p, idx) =>
      idx === currentTurnIndex ? { ...p, passedThisRound: true } : p
    );
    setPlayers(updatedPlayers);
    setHasRolledThisTurn(false);
    setSelectedChoice(null);
    setAvailableChoices([]);

    setLastActionMessage(`${activePlayer.name} đã bỏ cuộc vòng này.`);

    if (activePlayer.id === USER_ID) {
      triggerMascot({
        type: 'pass',
        message: `Nhịn một bước trời cao biển rộng meow! Giữ sức vòng sau phản kích! 🐾`,
        mood: 'comforting',
      });
    }

    // Check if round ends
    if (checkRoundEnd(updatedPlayers, tableLastPlayerId)) {
      resolveRound(tableLastPlayerId!, updatedPlayers);
    } else {
      const nextIdx = getNextActivePlayerIndex(currentTurnIndex, updatedPlayers);
      setCurrentTurnIndex(nextIdx);
    }
  };

  // User Action: Use Shield to re-roll
  const handleUseShield = () => {
    const activePlayer = players[currentTurnIndex] || players[0];
    sound.playShield();
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === currentTurnIndex ? { ...p, shieldUsedInRound: true } : p
      )
    );
    setHasRolledThisTurn(false);
    setSelectedChoice(null);
    setLastActionMessage(`🛡️ ${activePlayer.name} đã kích hoạt Khiên phòng thủ để gieo lại 4 xúc xắc.`);

    triggerMascot({
      type: 'shield',
      message: `🛡️ Khiên Hộ Mệnh kích hoạt thành công! May quá, cơ hội thứ hai đã đến meow!`,
      mood: 'comforting',
    });
  };

  // AI Turn Simulation Effect - CHỈ CHẠY CHO BOT KHI Ở CHẾ ĐỘ ĐẤU MÁY (gameMode === 'ai')
  useEffect(() => {
    // Tuyệt đối không chạy trong chế độ Đấu Người Thật (PvP)
    if (gameMode !== 'ai') return;

    const activeCurrent = players[currentTurnIndex];
    if (!activeCurrent || !activeCurrent.isAI || winner) return;

    const timer = setTimeout(() => {
      // 1. AI Rolls Dice
      setIsRolling(true);
      sound.playRoll();

      setTimeout(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        const d4 = Math.floor(Math.random() * 6) + 1;
        const rolled: [number, number, number, number] = [d1, d2, d3, d4];

        setCurrentDice(rolled);
        setIsRolling(false);

        const choices = evaluateRoll(rolled);
        const { counterAttackChoices, higherChoices } = getPlayableChoices(choices, tableChoice);

        // AI Strategy:
        // If has counter-attack (same rank), 60% chance to trigger it!
        if (counterAttackChoices.length > 0 && Math.random() < 0.6) {
          const choice = counterAttackChoices[0];
          sound.playCounterAttack();
          setIsCounterAttack(true);
          setTableChoice(choice);
          setTableLastPlayerId(activeCurrent.id);
          setLastActionMessage(
            `🔥 PHẢN CÔNG! ${activeCurrent.name} tung đòn phản công rực lửa với "${choice.name}"!`
          );

          triggerMascot({
            type: 'counter',
            message: `Xù lông! ${activeCurrent.name} vừa tung phản công bốc lửa kìa meow! Cẩn thận nha sen! 🔥`,
            mood: 'surprised',
          });

          const nextIdx = getNextActivePlayerIndex(currentTurnIndex, players);
          setCurrentTurnIndex(nextIdx);
        } else if (higherChoices.length > 0) {
          // Play lowest higher choice
          const choice = higherChoices[0];
          sound.playSelect();
          setIsCounterAttack(false);
          setTableChoice(choice);
          setTableLastPlayerId(activeCurrent.id);
          setLastActionMessage(
            `${activeCurrent.name} đã đánh "${choice.name}" (Hạng ${choice.rank}/36).`
          );

          const nextIdx = getNextActivePlayerIndex(currentTurnIndex, players);
          setCurrentTurnIndex(nextIdx);
        } else {
          // No valid choice -> Pass
          sound.playPass();
          const updatedPlayers = players.map((p, idx) =>
            idx === currentTurnIndex ? { ...p, passedThisRound: true } : p
          );
          setPlayers(updatedPlayers);
          setLastActionMessage(`${activeCurrent.name} không có bài lớn hơn và đã bỏ cuộc!`);

          if (checkRoundEnd(updatedPlayers, tableLastPlayerId)) {
            resolveRound(tableLastPlayerId!, updatedPlayers);
          } else {
            const nextIdx = getNextActivePlayerIndex(currentTurnIndex, updatedPlayers);
            setCurrentTurnIndex(nextIdx);
          }
        }
      }, 950);
    }, 1100);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    currentTurnIndex,
    players,
    tableChoice,
    tableLastPlayerId,
    winner,
    getNextActivePlayerIndex,
    checkRoundEnd,
    resolveRound,
  ]);

  // Restart match handler
  const handleRestartMatch = () => {
    setWinner(null);
    setRoundNumber(1);
    setTableChoice(null);
    setTableLastPlayerId(null);
    setIsCounterAttack(false);
    setHasRolledThisTurn(false);
    setSelectedChoice(null);
    setAvailableChoices([]);
    setCurrentTurnIndex(0);

    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        seatPoints: 0,
        passedThisRound: false,
        shieldUsedInRound: false,
      }))
    );

    setLastActionMessage('Trận đấu mới đã sẵn sàng! Gieo 4 xúc xắc để bắt đầu.');
  };

  // Start match from Lobby config
  const handleStartMatchFromLobby = ({
    mode,
    matchLength: newLength,
    playerCount,
    roomName,
    playerNames,
  }: {
    mode: GameMode;
    matchLength: MatchLength;
    playerCount: number;
    roomName: string;
    playerNames?: string[];
  }) => {
    setGameMode(mode);
    setMatchLength(newLength);
    setWinner(null);
    setRoundNumber(1);
    setTableChoice(null);
    setTableLastPlayerId(null);
    setIsCounterAttack(false);
    setHasRolledThisTurn(false);
    setSelectedChoice(null);
    setAvailableChoices([]);
    setCurrentTurnIndex(0);

    const botNames = [
      'Thần Bài Nam',
      'Đại Hiệp Dice',
      'Minh Vương',
      'Hồng Phúc',
      'Sơn Hải',
      'Bích Ngọc',
      'Kim Long',
      'Phượng Hoàng',
      'Võ Thần',
    ];
    const botAvatars = ['🤖', '🦁', '🦊', '🐉', '🎯', '⚡️', '🍀', '💎', '🔥'];
    const humanAvatars = ['🎲', '👤', '🧑‍🚀', '🧙‍♂️', '🥷', '🕵️', '👑', '🦸‍♂️', '🎯', '⚡️'];

    const newPlayerList: Player[] = [];

    for (let i = 0; i < playerCount; i++) {
      const isHost = i === 0;
      // In PvP mode, ALL PLAYERS ARE REAL HUMANS (isAI = false)
      const isAiPlayer = mode === 'ai' ? !isHost : false;

      let pName: string;
      if (mode === 'ai') {
        pName = isHost ? 'Bạn' : `Máy ${i} (${botNames[i - 1] || 'Bot'})`;
      } else {
        pName = playerNames?.[i]?.trim() || (isHost ? 'Bạn (Chủ Phòng)' : `Người Chơi ${i + 1}`);
      }

      newPlayerList.push({
        id: `player_${i + 1}`,
        name: pName,
        avatar: mode === 'ai' 
          ? (isHost ? '🎲' : botAvatars[i - 1] || '🤖') 
          : humanAvatars[i % humanAvatars.length],
        isAI: isAiPlayer,
        seatPoints: 0,
        hasShield: isHost ? profile.ownedShield : (mode === 'ai' ? Math.random() < 0.25 : false),
        shieldUsedInRound: false,
        hasDoublePoint: isHost ? profile.ownedDoublePoint : (mode === 'ai' ? Math.random() < 0.2 : false),
        isHost: isHost,
        tier: isHost ? tier : 'free',
        passedThisRound: false,
      });
    }

    setPlayers(newPlayerList);
    setLastActionMessage(
      mode === 'pvp'
        ? `🎮 Đấu Người Thật 100%: Phòng "${roomName}" với ${playerCount} người thật đã bắt đầu! Lượt đầu tiên: ${newPlayerList[0].name}.`
        : `Phòng đấu máy với ${playerCount} người chơi đã sẵn sàng! Mục tiêu ${newLength} Tọa Điểm.`
    );
  };

  // Economy & Shop transactions
  const handleUpgradeTier = (targetTier: TierType, durationDays?: number) => {
    if (targetTier === 'free') {
      setTier('free');
      setProfile((prev) => ({
        ...prev,
        tier: 'free',
        vipExpiresAt: null,
      }));
      setPlayers((prev) =>
        prev.map((p) => (p.id === USER_ID ? { ...p, tier: 'free' } : p))
      );
      return;
    }
    // Tạm thời khóa tính năng nâng cấp gói VIP/MAX vì cần thanh toán tiền thật
    console.warn('Tính năng thanh toán gói VIP/MAX tạm thời chưa mở.');
  };

  const handleBuyItem = (itemKey: string, cost: number, type: 'diamond' | 'vnd') => {
    if (type === 'diamond') {
      if (profile.diamonds < cost) return;
      setProfile((prev) => {
        const nextDiamonds = prev.diamonds - cost;
        if (itemKey === 'shield') return { ...prev, diamonds: nextDiamonds, ownedShield: true };
        if (itemKey === 'double_point') return { ...prev, diamonds: nextDiamonds, ownedDoublePoint: true };
        if (itemKey === 'leaderboard') return { ...prev, diamonds: nextDiamonds, unlockedLeaderboard: true };
        if (itemKey === 'minigame_reverse') return { ...prev, diamonds: nextDiamonds, unlockedMinigameReverse: true };
        if (itemKey === 'minigame_sum') return { ...prev, diamonds: nextDiamonds, unlockedMinigameSum: true };
        if (itemKey.startsWith('potion_')) {
          const potKey = itemKey.replace('potion_', '') as keyof typeof prev.potions;
          return {
            ...prev,
            diamonds: nextDiamonds,
            potions: { ...prev.potions, [potKey]: (prev.potions[potKey] || 0) + 1 },
          };
        }
        return { ...prev, diamonds: nextDiamonds };
      });
    }
  };

  // Claim 1 Diamond for Achievement
  const handleClaimPrize = (prizeId: string) => {
    setProfile((prev) => ({
      ...prev,
      diamonds: prev.diamonds + 1,
      achievements: {
        ...prev.achievements,
        [prizeId]: { unlocked: true, claimed: true },
      },
    }));
    sound.playSelect();
  };

  // Determine Background Theme based on Tier as explicitly requested:
  // "Khi đang ở gói miễn phí, nền là màu cam. Khi đang gói VIP, nền là màu tím. Khi đang gói MAX, nền là màu đen."
  const getThemeClasses = () => {
    switch (tier) {
      case 'max':
        return 'bg-gradient-to-b from-neutral-950 via-zinc-950 to-neutral-950 text-white';
      case 'vip':
        return 'bg-gradient-to-b from-purple-900 via-violet-950 to-indigo-950 text-white';
      case 'free':
      default:
        return 'bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600 text-white';
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-700 ${getThemeClasses()} font-['Plus_Jakarta_Sans',sans-serif]`}>
      {/* Top Header */}
      <Header
        profile={profile}
        tier={tier}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenMinigames={() => setIsMinigamesOpen(true)}
        onOpenLobby={() => setIsLobbyOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onTriggerCat={() => {
          triggerMascot({
            type: 'custom',
            message: 'Purrrr... Meow! Ondice Cat luôn sát cánh cùng bạn, chúc xúc xắc của bạn luôn nở hoa! 🐾',
            mood: 'playful',
          });
        }}
      />

      {/* Voice Chat Bar (Microphone for MAX mode) */}
      <div className="px-4">
        <VoiceChatBar
          currentTier={tier}
          hostTier={players[0]?.tier || 'free'}
          players={players}
          onUpgradeToMax={() => {
            setIsShopOpen(true);
          }}
        />
      </div>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col justify-center py-2">
        <GameTable
          players={players}
          currentTurnIndex={currentTurnIndex}
          currentDice={currentDice}
          isRolling={isRolling}
          hasRolledThisTurn={hasRolledThisTurn}
          availableChoices={availableChoices}
          selectedChoice={selectedChoice}
          tableChoice={tableChoice}
          tableLastPlayerId={tableLastPlayerId}
          isCounterAttack={isCounterAttack}
          lastActionMessage={lastActionMessage}
          roundNumber={roundNumber}
          matchLength={matchLength}
          mode={gameMode}
          tier={tier}
          winner={winner}
          onRollDice={handleRollDice}
          onSelectChoice={(c) => setSelectedChoice(c)}
          onPlayChoice={handlePlayChoice}
          onPass={handlePass}
          onUseShield={handleUseShield}
          onRestartMatch={handleRestartMatch}
          userPlayerId={USER_ID}
        />
      </main>

      {/* Footer / Status Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/70 border-t border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Ondice Online • Máy chủ hoạt động ổn định</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Gói hiện tại: <strong className="uppercase text-white">{tier}</strong></span>
          <span>•</span>
          <span>Tọa Điểm của bạn: <strong className="text-amber-300">{players[0]?.seatPoints || 0}</strong></span>
        </div>
      </footer>

      {/* Modals */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        profile={profile}
        tier={tier}
        onUpgradeTier={handleUpgradeTier}
        onBuyItem={handleBuyItem}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        profile={profile}
        onClaimPrize={handleClaimPrize}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        profile={profile}
        tier={tier}
        onUnlockLeaderboard={() => {
          if (profile.diamonds >= 15) {
            handleBuyItem('leaderboard', 15, 'diamond');
          }
        }}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <MinigamesModal
        isOpen={isMinigamesOpen}
        onClose={() => setIsMinigamesOpen(false)}
        profile={profile}
        onRewardDiamonds={(amt) =>
          setProfile((prev) => ({ ...prev, diamonds: prev.diamonds + amt }))
        }
        onOpenShop={() => {
          setIsMinigamesOpen(false);
          setIsShopOpen(true);
        }}
      />

      <LobbyModal
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        tier={tier}
        onStartMatch={handleStartMatchFromLobby}
        onOpenShop={() => {
          setIsLobbyOpen(false);
          setIsShopOpen(true);
        }}
      />

      {/* Ondice Cat Mascot Companion */}
      <OndiceCat
        currentEvent={mascotEvent}
        onClearEvent={() => setMascotEvent(null)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
