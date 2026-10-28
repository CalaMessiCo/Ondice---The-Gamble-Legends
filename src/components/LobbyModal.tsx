import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Plus, 
  Bot, 
  Crown, 
  Play, 
  Sliders, 
  Lock,
  Trash2,
  Share2,
  CheckCircle2,
  User
} from 'lucide-react';
import { TierType, MatchLength, GameMode, RoomInfo } from '../types/ondice';

interface HostedRoomRecord {
  id: string;
  name: string;
  hostName: string;
  playerCount: number;
  matchLength: MatchLength;
  playerNames: string[];
  createdAt: number;
}

interface LobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: TierType;
  onStartMatch: (config: {
    mode: GameMode;
    matchLength: MatchLength;
    playerCount: number;
    roomName: string;
    playerNames?: string[];
  }) => void;
  onOpenShop: () => void;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  onClose,
  tier,
  onStartMatch,
  onOpenShop,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');
  const [matchLength, setMatchLength] = useState<MatchLength>(5);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [roomName, setRoomName] = useState<string>('Phòng Ondice Chiến Thuật');
  const [view, setView] = useState<'create' | 'my_rooms'>('create');
  
  // Custom player names for real multiplayer (PvP)
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Bạn (Chủ Phòng)',
    'Người Chơi 2',
    'Người Chơi 3',
    'Người Chơi 4',
    'Người Chơi 5',
    'Người Chơi 6',
    'Người Chơi 7',
    'Người Chơi 8',
    'Người Chơi 9',
    'Người Chơi 10',
  ]);

  // Saved hosted rooms in localStorage
  const [myRooms, setMyRooms] = useState<HostedRoomRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ondice_my_hosted_rooms');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const saveRooms = (rooms: HostedRoomRecord[]) => {
    setMyRooms(rooms);
    try {
      localStorage.setItem('ondice_my_hosted_rooms', JSON.stringify(rooms));
    } catch {}
  };

  const maxAllowedPlayers = tier === 'free' ? 6 : 10;

  if (!isOpen) return null;

  const handleUpdatePlayerName = (index: number, newName: string) => {
    setPlayerNames((prev) => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
  };

  const handleHostAndStart = () => {
    const activeNames = playerNames.slice(0, playerCount).map((name, i) => 
      name.trim() ? name.trim() : (i === 0 ? 'Bạn (Chủ Phòng)' : `Người Chơi ${i + 1}`)
    );

    // Save room to history
    const newRoom: HostedRoomRecord = {
      id: `room_${Date.now()}`,
      name: roomName.trim() || 'Phòng Ondice',
      hostName: activeNames[0],
      playerCount,
      matchLength,
      playerNames: activeNames,
      createdAt: Date.now(),
    };

    saveRooms([newRoom, ...myRooms.slice(0, 9)]);

    onStartMatch({
      mode: 'pvp',
      matchLength,
      playerCount,
      roomName: newRoom.name,
      playerNames: activeNames,
    });
    onClose();
  };

  const handleDeleteRoom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = myRooms.filter((r) => r.id !== id);
    saveRooms(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/20 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Sảnh Đấu Ondice
              </h2>
              <p className="text-xs text-white/60">
                Đấu Người Thật 100% (Không Bot) hoặc Luyện Tập Đấu Máy (AI)
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

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-3 px-6 pt-4">
          <button
            onClick={() => setSelectedMode('pvp')}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
              selectedMode === 'pvp'
                ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/30 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Đấu Người Thật 100%</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-extrabold uppercase">
                  Không Bot
                </span>
              </div>
              <div className="text-[10px] text-white/60">Người thật tự host & tự tay gieo xúc xắc từng lượt</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedMode('ai')}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
              selectedMode === 'ai'
                ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/30 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Chế Độ Đấu Máy (AI)</div>
              <div className="text-[10px] text-white/60">Luyện tập nhanh với máy tự động</div>
            </div>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {selectedMode === 'ai' ? (
            /* AI Settings */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Cài Đặt Trận Đấu Máy Luyện Tập
                </h3>

                {/* Match Length */}
                <div>
                  <label className="text-xs text-white/70 block mb-2 font-medium">
                    Chọn Mục Tiêu Tọa Điểm Chiến Thắng:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 5 as MatchLength, label: 'Bản Ngắn (5 Điểm)' },
                      { val: 10 as MatchLength, label: 'Bản Vừa (10 Điểm)' },
                      { val: 15 as MatchLength, label: 'Bản Lâu (15 Điểm)' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => setMatchLength(item.val)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          matchLength === item.val
                            ? 'bg-cyan-500 text-neutral-950 border-cyan-300 shadow'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of opponents */}
                <div>
                  <label className="text-xs text-white/70 block mb-2 font-medium">
                    Số Lượng Người Trên Bàn: {playerCount} người (Bạn và {playerCount - 1} Bot máy)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[2, 3, 4, 5, 6, ...(tier !== 'free' ? [7, 8, 9, 10] : [])].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPlayerCount(num)}
                        className={`w-9 h-9 rounded-xl text-xs font-black border transition-all ${
                          playerCount === num
                            ? 'bg-cyan-500 text-neutral-950 border-cyan-300'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {tier === 'free' && (
                    <p className="text-[11px] text-amber-300/80 mt-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Gói miễn phí: 2 - 6 người. Nâng cấp VIP/MAX để chơi bàn 7 - 10 người!
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  onStartMatch({
                    mode: 'ai',
                    matchLength,
                    playerCount,
                    roomName: 'Đấu Máy Luyện Tập',
                  });
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-black rounded-2xl shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-neutral-950" />
                <span>BẮT ĐẦU ĐẤU MÁY</span>
              </button>
            </div>
          ) : (
            /* REAL PERSON PVP MULTIPLAYER LOBBY */
            <div className="space-y-4">
              {/* Tabs: Create Host Room vs Saved Rooms */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView('create')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      view === 'create'
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Phòng Host Mới</span>
                  </button>
                  <button
                    onClick={() => setView('my_rooms')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      view === 'my_rooms'
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <span>Phòng Đã Lưu Của Bạn ({myRooms.length})</span>
                  </button>
                </div>

                <div className="text-xs text-white/60">
                  Quyền hạn phòng: <strong className="text-amber-300">Tối đa {maxAllowedPlayers} người thật</strong>
                </div>
              </div>

              {view === 'create' ? (
                /* Host Room Configuration Form */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    {/* Notice */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Chế độ Người Thật 100%:</strong> Không có bot tự động. Mỗi người chơi sẽ trực tiếp gieo xúc xắc và chọn tổ hợp khi đến lượt của mình.
                      </span>
                    </div>

                    {/* Room Name */}
                    <div>
                      <label className="text-xs text-white/70 block mb-1 font-medium">
                        Tên Phòng Host:
                      </label>
                      <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Nhập tên phòng..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {/* Target Points */}
                    <div>
                      <label className="text-xs text-white/70 block mb-1 font-medium">
                        Mục Tiêu Tọa Điểm Chiến Thắng:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 5 as MatchLength, label: 'Bản Ngắn (5 Điểm)' },
                          { val: 10 as MatchLength, label: 'Bản Vừa (10 Điểm)' },
                          { val: 15 as MatchLength, label: 'Bản Lâu (15 Điểm)' },
                        ].map((item) => (
                          <button
                            key={item.val}
                            onClick={() => setMatchLength(item.val)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              matchLength === item.val
                                ? 'bg-emerald-500 text-neutral-950 border-emerald-300'
                                : 'bg-white/5 border-white/10 text-white/80'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Player count selector */}
                    <div>
                      <label className="text-xs text-white/70 block mb-1 font-medium">
                        Số Lượng Người Thật Tham Gia ({playerCount} người):
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[2, 3, 4, 5, 6, ...(tier !== 'free' ? [7, 8, 9, 10] : [])].map((num) => (
                          <button
                            key={num}
                            onClick={() => setPlayerCount(num)}
                            className={`w-9 h-9 rounded-xl text-xs font-black border transition-all ${
                              playerCount === num
                                ? 'bg-emerald-500 text-neutral-950 border-emerald-300'
                                : 'bg-white/5 border-white/10 text-white/80'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      {tier === 'free' && (
                        <button
                          onClick={onOpenShop}
                          className="text-[11px] text-amber-300 hover:underline mt-1.5 flex items-center gap-1"
                        >
                          <Crown className="w-3 h-3" />
                          Gói miễn phí tối đa 6 người. Nâng VIP/MAX để mở phòng 10 người & Micro!
                        </button>
                      )}
                    </div>

                    {/* Players Name Customization */}
                    <div>
                      <label className="text-xs text-white/70 block mb-1.5 font-medium">
                        Danh Sách Tên Người Thật Trên Bàn Đấu:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {Array.from({ length: playerCount }).map((_, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-1.5 rounded-xl bg-black/30 border border-white/10"
                          >
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {idx === 0 ? '👑' : `${idx + 1}`}
                            </div>
                            <input
                              type="text"
                              value={playerNames[idx] || ''}
                              onChange={(e) => handleUpdatePlayerName(idx, e.target.value)}
                              placeholder={idx === 0 ? 'Tên Chủ Phòng (Bạn)' : `Tên Người Chơi ${idx + 1}`}
                              className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none placeholder:text-white/30"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Start Host Room Button */}
                  <button
                    onClick={handleHostAndStart}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-sm rounded-2xl shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-neutral-950" />
                    <span>TẠO PHÒNG VÀ VÀO BÀN ĐẤU NGƯỜI THẬT</span>
                  </button>
                </div>
              ) : (
                /* My Saved / Hosted Rooms */
                <div className="space-y-3">
                  {myRooms.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/15 space-y-3">
                      <Users className="w-10 h-10 text-white/30 mx-auto" />
                      <p className="text-xs text-white/60">
                        Chưa có phòng người thật nào được lưu.
                      </p>
                      <button
                        onClick={() => setView('create')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl"
                      >
                        + Tạo Phòng Host Mới Ngay
                      </button>
                    </div>
                  ) : (
                    myRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => {
                          onStartMatch({
                            mode: 'pvp',
                            matchLength: room.matchLength,
                            playerCount: room.playerCount,
                            roomName: room.name,
                            playerNames: room.playerNames,
                          });
                          onClose();
                        }}
                        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-sm">
                            👥
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {room.name}
                            </h4>
                            <p className="text-[11px] text-white/60">
                              Host: {room.hostName} • Bản {room.matchLength} Tọa Điểm • {room.playerCount} người thật
                            </p>
                            <div className="text-[10px] text-emerald-300/80 mt-0.5 truncate max-w-sm">
                              Danh sách: {room.playerNames?.join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDeleteRoom(room.id, e)}
                            className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Xóa phòng này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 font-black text-xs">
                            VÀO BÀN
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

