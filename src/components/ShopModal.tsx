import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Shield, 
  Zap, 
  Trophy, 
  Gamepad2, 
  FlaskConical, 
  Check, 
  Gem, 
  CreditCard,
  Flame,
  Radio,
  Lock,
  AlertCircle
} from 'lucide-react';
import { UserProfile, TierType } from '../types/ondice';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  tier: TierType;
  onUpgradeTier: (targetTier: TierType, durationDays?: number) => void;
  onBuyItem: (itemKey: string, cost: number, type: 'diamond' | 'vnd') => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  profile,
  tier,
  onUpgradeTier,
  onBuyItem,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'effects' | 'minigames' | 'potions'>('packages');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/20 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Cửa Hàng Ondice VIP & Vật Phẩm
              </h2>
              <p className="text-xs text-white/60">
                Nâng cấp trải nghiệm, hiệu ứng phản công, khiên và minigames
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-400/40 px-3 py-1.5 rounded-xl text-cyan-200 font-bold text-xs">
              <Gem className="w-3.5 h-3.5 text-cyan-300 fill-cyan-400" />
              <span>{profile.diamonds} Kim Cương</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold text-center animate-fade-in">
            {notification}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'packages'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            👑 Gói VIP & MAX
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'effects'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🛡️ Hiệu Ứng Khiên & Điểm
          </button>
          <button
            onClick={() => setActiveTab('minigames')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'minigames'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🎮 Minigames & BXH
          </button>
          <button
            onClick={() => setActiveTab('potions')}
            className={`px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'potions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🧪 Thuốc Buff (1 Trận)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* TAB 1: GÓI VIP & MAX */}
          {activeTab === 'packages' && (
            <div className="flex flex-col gap-4">
              {/* Notice Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3 text-xs text-amber-200">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-2">
                    <span>CỔNG THANH TOÁN TIỀN THẬT ĐANG TẠM ĐÓNG</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-mono font-bold">
                      Chưa Mở Giao Dịch
                    </span>
                  </div>
                  <p className="mt-1 text-white/70 leading-relaxed">
                    Các gói VIP và MAX yêu cầu giao dịch tiền mặt (699.000đ - 1.299.000đ). Hệ thống hiện chưa tích hợp cổng nạp/thanh toán trực tuyến nên tính năng mua gói đang được tạm khóa, không thể kích hoạt bằng cách bấm nút.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Gói Miễn Phí Card */}
                <div className={`relative rounded-2xl bg-gradient-to-b from-orange-950/60 to-orange-900/30 border-2 ${tier === 'free' ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-orange-500/10' : 'border-white/10'} p-5 flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
                          <Flame className="w-5 h-5 fill-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-orange-200 font-['Outfit',sans-serif]">
                            GÓI MIỄN PHÍ
                          </h3>
                          <p className="text-[11px] text-orange-300/80">Nền cam rực rỡ • 2 - 6 người</p>
                        </div>
                      </div>

                      {tier === 'free' ? (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                          Đang Dùng
                        </span>
                      ) : (
                        <span className="bg-white/10 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Mặc Định
                        </span>
                      )}
                    </div>

                    <ul className="my-4 space-y-2 text-xs text-white/80">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span>Giao diện nền màu cam tiêu chuẩn Ondice</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span>Quy mô phòng từ 2 đến 6 người chơi</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span>Chơi tự do không giới hạn ván đấu</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <span>Hỗ trợ cả Đấu Máy và Đấu Người Thật 100%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-orange-500/20 flex flex-col gap-2">
                    {tier === 'free' ? (
                      <div className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>Đang Sử Dụng Gói Miễn Phí</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onUpgradeTier('free');
                          showToast('Đã chuyển sang Gói Miễn Phí (Nền Cam)!');
                        }}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <Flame className="w-3.5 h-3.5 fill-neutral-950" />
                        <span>Chuyển Sang Gói Miễn Phí</span>
                      </button>
                    )}
                    <p className="text-[10px] text-center text-orange-300/60 italic">
                      *Gói hoàn toàn miễn phí, không mất phí
                    </p>
                  </div>
                </div>

                {/* Gói VIP Card */}
                <div className="relative rounded-2xl bg-gradient-to-b from-purple-950/60 to-purple-900/30 border-2 border-purple-500/50 p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                        <Crown className="w-5 h-5 fill-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-purple-200 font-['Outfit',sans-serif]">
                          GÓI VIP ONDICE
                        </h3>
                        <p className="text-[11px] text-purple-300/80">Nền tím hoàng gia • 2 - 10 người</p>
                      </div>
                    </div>

                    {tier === 'vip' ? (
                      <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Đang Dùng
                      </span>
                    ) : (
                      <span className="bg-white/10 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
                        699.000 VND / Năm
                      </span>
                    )}
                  </div>

                  <ul className="my-4 space-y-2 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>Đổi giao diện nền màu tím quý phái</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>Mở rộng phòng từ 2 đến 10 người (bản free chỉ 2-6)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>Nhiều giải thưởng & cơ hội nhận Kim Cương hơn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>Mở khóa sẵn Bảng Xếp Hạng</span>
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        showToast('⚠️ Cổng thanh toán chưa mở! Gói VIP yêu cầu giao dịch 699.000đ thực tế, hiện chưa hỗ trợ thanh toán.');
                      }}
                      className="w-full py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-inner"
                    >
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tạm Khóa Mua VIP (699.000 VND)</span>
                    </button>
                    <p className="text-[10px] text-center text-purple-300/60 italic">
                      *Cần nạp tiền thực tế, tạm thời chưa mở cổng thanh toán
                    </p>
                  </div>
                </div>

                {/* Gói MAX Card */}
                <div className="relative rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-amber-400 p-5 flex flex-col justify-between shadow-xl shadow-amber-500/10">
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                    Đỉnh Cao Nhất
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-5 h-5 fill-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-amber-300 font-['Outfit',sans-serif]">
                          GÓI MAX ONDICE
                        </h3>
                        <p className="text-[11px] text-amber-400/80">Nền đen huyền bí • Trò chuyện Micro</p>
                      </div>
                    </div>

                    {tier === 'max' ? (
                      <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Đang Dùng
                      </span>
                    ) : (
                      <span className="bg-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                        1.299.000 VND / Vĩnh Viễn
                      </span>
                    )}
                  </div>

                  <ul className="my-4 space-y-2 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-amber-200 font-bold">
                        Trò chuyện Micro trực tiếp trong trận Đấu Người Thật!
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-white/70">
                      <span className="text-xs">🎙️</span>
                      <span>Chỉ cần Host có MAX, cả phòng đều được mở Micro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Nền đen Obsidian sang trọng, viền vàng kim loại</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Bao gồm toàn bộ đặc quyền của gói VIP (2-10 người)</span>
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-amber-500/20 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        showToast('⚠️ Cổng thanh toán chưa mở! Gói MAX yêu cầu giao dịch 1.299.000đ thực tế, hiện chưa hỗ trợ thanh toán.');
                      }}
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-inner"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tạm Khóa Mua Gói MAX (1.299.000 VND)</span>
                    </button>
                    <p className="text-[10px] text-center text-amber-300/60 italic">
                      *Cần nạp tiền thực tế, tạm thời chưa mở cổng thanh toán
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HIỆU ỨNG ĐẶC BIỆT */}
          {activeTab === 'effects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khiên */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Shield className="w-6 h-6 fill-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Hiệu Ứng Khiên</h4>
                    <p className="text-xs text-white/70 mt-1">
                      Nếu gieo xúc xắc bé hơn tổ hợp trên bàn, bạn sẽ có cơ hội kích hoạt Khiên để gieo lại 1 lần duy nhất trong vòng!
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <Gem className="w-3.5 h-3.5 fill-cyan-400" /> 10 Kim Cương
                  </span>
                  {profile.ownedShield ? (
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl">
                      Đã Sở Hữu
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (profile.diamonds >= 10) {
                          onBuyItem('shield', 10, 'diamond');
                          showToast('Đã mở khóa Hiệu Ứng Khiên!');
                        } else {
                          showToast('Bạn cần 10 Kim Cương!');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Mở Khóa
                    </button>
                  )}
                </div>
              </div>

              {/* Nhân Đôi */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Zap className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Hiệu Ứng Nhân Đôi</h4>
                    <p className="text-xs text-white/70 mt-1">
                      Có 50% tỉ lệ may mắn nhận được <strong>2 Tọa Điểm</strong> sau khi tất cả đối thủ khác bỏ cuộc trong vòng!
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <Gem className="w-3.5 h-3.5 fill-cyan-400" /> 12 Kim Cương
                  </span>
                  {profile.ownedDoublePoint ? (
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl">
                      Đã Sở Hữu
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (profile.diamonds >= 12) {
                          onBuyItem('double_point', 12, 'diamond');
                          showToast('Đã mở khóa Hiệu Ứng Nhân Đôi!');
                        } else {
                          showToast('Bạn cần 12 Kim Cương!');
                        }
                      }}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl transition-all"
                    >
                      Mở Khóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MINIGAMES & BXH */}
          {activeTab === 'minigames' && (
            <div className="space-y-3">
              {/* Bảng Xếp Hạng */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Hệ Thống Bảng Xếp Hạng</h4>
                    <p className="text-xs text-white/60">
                      Tính theo tổng số Tọa Điểm tích lũy trên toàn hệ thống Ondice
                    </p>
                  </div>
                </div>

                <div>
                  {profile.unlockedLeaderboard || tier !== 'free' ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl">
                      Đã Mở Khóa
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (profile.diamonds >= 15) {
                          onBuyItem('leaderboard', 15, 'diamond');
                          showToast('Đã mở khóa Bảng Xếp Hạng!');
                        } else {
                          showToast('Bạn cần 15 Kim Cương!');
                        }
                      }}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
                    >
                      Mở (15 KC)
                    </button>
                  )}
                </div>
              </div>

              {/* Minigame 1: Ondice Đảo Ngược */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Minigame: Ondice Đảo Ngược</h4>
                    <p className="text-xs text-white/60">
                      Luật chơi ngược: Gieo số càng nhỏ càng mạnh (1 đơn là tối thượng!)
                    </p>
                  </div>
                </div>

                <div>
                  {profile.unlockedMinigameReverse ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl">
                      Đã Mở Khóa
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (profile.diamonds >= 8) {
                          onBuyItem('minigame_reverse', 8, 'diamond');
                          showToast('Đã mở khóa Minigame Ondice Đảo Ngược!');
                        } else {
                          showToast('Bạn cần 8 Kim Cương!');
                        }
                      }}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl"
                    >
                      Mở (8 KC)
                    </button>
                  )}
                </div>
              </div>

              {/* Minigame 2: Ondice Cộng Dồn */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Minigame: Ondice Cộng Dồn</h4>
                    <p className="text-xs text-white/60">
                      Cộng dồn kết quả 4 xúc xắc qua các lượt và so sánh tổng điểm
                    </p>
                  </div>
                </div>

                <div>
                  {profile.unlockedMinigameSum ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl">
                      Đã Mở Khóa
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (profile.diamonds >= 8) {
                          onBuyItem('minigame_sum', 8, 'diamond');
                          showToast('Đã mở khóa Minigame Ondice Cộng Dồn!');
                        } else {
                          showToast('Bạn cần 8 Kim Cương!');
                        }
                      }}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl"
                    >
                      Mở (8 KC)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THUỐC BUFF */}
          {activeTab === 'potions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'lucky',
                  name: 'Thuốc May Mắn',
                  cost: 3,
                  desc: 'Tăng 35% khả năng gieo được các số 5 và 6 trong trận',
                  color: 'text-amber-300 bg-amber-500/20 border-amber-400/40',
                },
                {
                  id: 'reroll',
                  name: 'Thuốc Đổi 1 Xúc Xắc',
                  cost: 4,
                  desc: 'Cho phép bạn chọn gieo lại riêng 1 viên xúc xắc bất kỳ',
                  color: 'text-cyan-300 bg-cyan-500/20 border-cyan-400/40',
                },
                {
                  id: 'hellfire',
                  name: 'Thuốc Hỏa Ngục Phản Công',
                  cost: 5,
                  desc: 'Mọi cú đánh đôi bất kỳ đều kích hoạt hiệu ứng Phản Công bốc lửa!',
                  color: 'text-red-300 bg-red-500/20 border-red-400/40',
                },
                {
                  id: 'insight',
                  name: 'Thuốc Thần Nhãn',
                  cost: 2,
                  desc: 'Tự động tính toán và đánh dấu nước đi có xác suất chiến thắng cao nhất',
                  color: 'text-purple-300 bg-purple-500/20 border-purple-400/40',
                },
              ].map((pot) => {
                const count = profile.potions[pot.id as keyof typeof profile.potions] || 0;

                return (
                  <div key={pot.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-bold text-white">{pot.name}</h4>
                        </div>
                        <span className="text-xs font-bold text-white/60">
                          Có: {count}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-1.5">{pot.desc}</p>
                      <p className="text-[10px] text-amber-300/80 mt-1 italic">
                        *Lưu ý: Mua 1 chỉ dùng trong 1 trận đấu
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                        <Gem className="w-3 h-3 fill-cyan-400" /> {pot.cost} KC
                      </span>
                      <button
                        onClick={() => {
                          if (profile.diamonds >= pot.cost) {
                            onBuyItem(`potion_${pot.id}`, pot.cost, 'diamond');
                            showToast(`Đã mua 1 ${pot.name}!`);
                          } else {
                            showToast(`Bạn cần ${pot.cost} Kim Cương!`);
                          }
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
                      >
                        Mua (+1)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
