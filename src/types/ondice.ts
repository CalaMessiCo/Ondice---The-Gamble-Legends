export type TierType = 'free' | 'vip' | 'max';

export type GameMode = 'ai' | 'pvp';
export type MatchLength = 5 | 10 | 15; // Bản ngắn (5), Bản vừa (10), Bản lâu (15)

export type HandType = 
  | 'single'      // đơn
  | 'pair'        // đôi
  | 'straight3'   // 3 số liên tiếp
  | 'triple'      // tam
  | 'straight4'   // 4 số liên tiếp
  | 'two_pairs'   // đôi hai
  | 'quad';       // tứ

export interface OndiceChoice {
  id: string;
  name: string;           // e.g. "1 đơn", "2 đôi", "1 ~ 3", "đôi hai có tối đại 4", "1 tứ"
  rank: number;           // 1 to 36 according to official Ondice hierarchy
  type: HandType;
  value: number;          // primary value (e.g. die number or max die)
  diceIndices: number[];  // which dice from the 4 rolled dice were used
  description?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isAI: boolean;
  seatPoints: number;     // Tọa Điểm
  hasShield: boolean;     // Có khiên phòng thủ
  shieldUsedInRound: boolean;
  hasDoublePoint: boolean;// Tỉ lệ 50% nhận 2 Tọa Điểm
  activePotion?: string | null;
  isHost?: boolean;
  tier: TierType;
  isMuted?: boolean;
  isSpeaking?: boolean;
  passedThisRound: boolean;
}

export interface PrizeAchievement {
  id: string;
  name: string;           // "1 tam", ..., "6 tam", "1 tứ", ..., "6 tứ"
  category: 'tam' | 'tu';
  value: number;
  rank: number;
  unlocked: boolean;
  claimed: boolean;
}

export interface RoomInfo {
  id: string;
  name: string;
  hostName: string;
  hostTier: TierType;
  maxPlayers: number;
  currentPlayers: number;
  matchLength: MatchLength;
  status: 'waiting' | 'in_game';
}

export interface GameState {
  mode: GameMode;
  matchLength: MatchLength;
  roundNumber: number;
  currentTurnIndex: number;
  players: Player[];
  currentDice: [number, number, number, number];
  isRolling: boolean;
  hasRolledThisTurn: boolean;
  availableChoices: OndiceChoice[];
  selectedChoice: OndiceChoice | null;
  tableChoice: OndiceChoice | null;
  tableLastPlayerId: string | null;
  isCounterAttack: boolean; // Phản công (chọn giống tổ hợp trước)
  lastActionMessage: string;
  winner: Player | null;
}

export interface UserProfile {
  diamonds: number;
  tier: TierType;
  vipExpiresAt: number | null; // timestamp
  ownedShield: boolean;
  ownedDoublePoint: boolean;
  unlockedLeaderboard: boolean;
  unlockedMinigameReverse: boolean;
  unlockedMinigameSum: boolean;
  potions: {
    lucky: number;
    reroll: number;
    hellfire: number;
    insight: number;
  };
  achievements: Record<string, { unlocked: boolean; claimed: boolean }>;
  totalSeatPoints: number;
  matchesWon: number;
}

/**
 * EXACT RANKING TABLE ACCORDING TO USER SPECIFICATION:
 * 1. 1 đơn
 * 2. 2 đơn
 * 3. 3 đơn
 * 4. 4 đơn
 * 5. 5 đơn
 * 6. 1 đôi
 * 7. 2 đôi
 * 8. 3 đôi
 * 9. 4 đôi
 * 10. 5 đôi
 * 11. 6 đơn  (Lưu ý: 6 đơn lớn hơn 5 đôi!)
 * 12. 1 ~ 3
 * 13. 2 ~ 4
 * 14. 3 ~ 5
 * 15. 4 ~ 6
 * 16. 1 tam
 * 17. 2 tam
 * 18. 3 tam
 * 19. 4 tam
 * 20. 5 tam
 * 21. 6 đôi  (Lưu ý: 6 đôi lớn hơn 5 tam!)
 * 22. 1 ~ 4
 * 23. 2 ~ 5
 * 24. 3 ~ 6
 * 25. 6 tam  (Lưu ý: 6 tam lớn hơn 3 ~ 6!)
 * 26. đôi hai có tối đại 2 (vd 1-1-2-2)
 * 27. đôi hai có tối đại 3
 * 28. đôi hai có tối đại 4
 * 29. đôi hai có tối đại 5
 * 30. đôi hai có tối đại 6
 * 31. 1 tứ
 * 32. 2 tứ
 * 33. 3 tứ
 * 34. 4 tứ
 * 35. 5 tứ
 * 36. 6 tứ
 */
export const RANK_NAMES: Record<number, string> = {
  1: '1 đơn',
  2: '2 đơn',
  3: '3 đơn',
  4: '4 đơn',
  5: '5 đơn',
  6: '1 đôi',
  7: '2 đôi',
  8: '3 đôi',
  9: '4 đôi',
  10: '5 đôi',
  11: '6 đơn',
  12: '1 ~ 3',
  13: '2 ~ 4',
  14: '3 ~ 5',
  15: '4 ~ 6',
  16: '1 tam',
  17: '2 tam',
  18: '3 tam',
  19: '4 tam',
  20: '5 tam',
  21: '6 đôi',
  22: '1 ~ 4',
  23: '2 ~ 5',
  24: '3 ~ 6',
  25: '6 tam',
  26: 'đôi hai tối đại 2',
  27: 'đôi hai tối đại 3',
  28: 'đôi hai tối đại 4',
  29: 'đôi hai tối đại 5',
  30: 'đôi hai tối đại 6',
  31: '1 tứ',
  32: '2 tứ',
  33: '3 tứ',
  34: '4 tứ',
  35: '5 tứ',
  36: '6 tứ',
};

// 12 Giải thưởng theo đề bài:
export const PRIZE_COMBINATIONS = [
  { id: '1_tam', name: '1 tam', category: 'tam' as const, value: 1, rank: 16 },
  { id: '2_tam', name: '2 tam', category: 'tam' as const, value: 2, rank: 17 },
  { id: '3_tam', name: '3 tam', category: 'tam' as const, value: 3, rank: 18 },
  { id: '4_tam', name: '4 tam', category: 'tam' as const, value: 4, rank: 19 },
  { id: '5_tam', name: '5 tam', category: 'tam' as const, value: 5, rank: 20 },
  { id: '6_tam', name: '6 tam', category: 'tam' as const, value: 6, rank: 25 },
  { id: '1_tu', name: '1 tứ', category: 'tu' as const, value: 1, rank: 31 },
  { id: '2_tu', name: '2 tứ', category: 'tu' as const, value: 2, rank: 32 },
  { id: '3_tu', name: '3 tứ', category: 'tu' as const, value: 3, rank: 33 },
  { id: '4_tu', name: '4 tứ', category: 'tu' as const, value: 4, rank: 34 },
  { id: '5_tu', name: '5 tứ', category: 'tu' as const, value: 5, rank: 35 },
  { id: '6_tu', name: '6 tứ', category: 'tu' as const, value: 6, rank: 36 },
];
