import React from 'react';
import { X, BookOpen, Flame, Shield, Zap, Sparkles, Award, Mic } from 'lucide-react';
import { RANK_NAMES } from '../types/ondice';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/20 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Luật Chơi Trò Chơi Ondice
              </h2>
              <p className="text-xs text-white/60">
                Quy tắc gieo xúc xắc, bảng thứ tự lớn hơn và tính năng Phản Công
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm text-white/90">
          {/* Section 1: Cốt Lõi */}
          <section className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-black text-amber-300 mb-2 flex items-center gap-2">
              🎲 Quy Tắc Cơ Bản & Gieo Xúc Xắc
            </h3>
            <p className="leading-relaxed text-white/80">
              Ondice là trò chơi xúc xắc may rủi kết hợp chiến thuật. Mỗi lượt, người chơi gieo <strong>4 xúc xắc cùng lúc</strong>.
              Từ 4 xúc xắc này sẽ sinh ra các loại lựa chọn: <strong>đơn, đôi, 3 số liên tiếp, tam, 4 số liên tiếp, đôi hai (2 đôi), tứ</strong>.
            </p>
            <p className="leading-relaxed text-white/80 mt-2">
              Ví dụ: Nếu gieo được <strong className="text-amber-200">[1, 2, 5, 2]</strong>, bạn có thể chọn <strong>1 đơn, 2 đơn, 5 đơn, hoặc 2 đôi</strong>.
            </p>
          </section>

          {/* Section 2: Thứ tự lớn hơn */}
          <section className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-black text-amber-300 mb-2 flex items-center gap-2">
              📊 Bảng Xếp Hạng Thứ Tự Lớn Hơn (Chuẩn 36 Bậc)
            </h3>
            <p className="text-xs text-white/70 mb-3">
              Người chơi sau phải đánh lựa chọn có thứ tự <strong>lớn hơn</strong> lựa chọn hiện tại trên bàn.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-xs font-mono">
              {Object.entries(RANK_NAMES).map(([rankStr, name]) => {
                const rank = Number(rankStr);
                const isSpecial = rank === 11 || rank === 21 || rank === 25; // 6 đơn, 6 đôi, 6 tam
                const isQuad = rank >= 31;

                return (
                  <div
                    key={rank}
                    className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between ${
                      isQuad
                        ? 'bg-red-950/40 border-red-500/30 text-amber-200'
                        : isSpecial
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                        : 'bg-black/30 border-white/5 text-white/80'
                    }`}
                  >
                    <span className="text-[10px] text-white/40">#{rank}</span>
                    <span className="font-bold">{name}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-white/60 mt-3 italic">
              *Đặc biệt: 6 đơn (hạng 11) xếp sau 5 đôi; 6 đôi (hạng 21) xếp sau 5 tam; 6 tam (hạng 25) xếp sau 3 ~ 6; Đôi hai tối đại tính theo số cặp lớn nhất (vd 1-1-2-2 có tối đại 2).
            </p>
          </section>

          {/* Section 3: Phản Công & Tọa Điểm */}
          <section className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-orange-950/40 border border-red-500/30">
            <h3 className="text-base font-black text-red-300 mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500 fill-amber-300" />
              Hiệu Ứng "Phản Công" & Tính Tọa Điểm
            </h3>
            <ul className="space-y-2 leading-relaxed text-white/80">
              <li>
                🔥 <strong>Phản Công:</strong> Nếu người chơi gieo và chọn tổ hợp <strong>trùng khớp hoàn toàn</strong> với tổ hợp hiện tại trên bàn, hiệu ứng phản công bốc lửa được kích hoạt! Xúc xắc bốc lửa và bay nhanh hơn vào người tiếp theo, tạo áp lực cực lớn!
              </li>
              <li>
                ⭐️ <strong>Tọa Điểm:</strong> Nếu người kia gieo mà không có lựa chọn lớn hơn hiện tại (hoặc bỏ cuộc), vòng chơi sẽ kết thúc. Người đặt cao nhất nhận <strong>+1 Tọa Điểm</strong> và bắt đầu vòng mới với bàn trống!
              </li>
              <li>
                🏆 <strong>Điều kiện chiến thắng:</strong> Ai đạt đủ điểm trước sẽ thắng trận:
                <strong> 5 Tọa Điểm (Bản ngắn)</strong> / <strong> 10 Tọa Điểm (Bản vừa)</strong> / <strong> 15 Tọa Điểm (Bản lâu)</strong>.
              </li>
            </ul>
          </section>

          {/* Section 4: Gói VIP & MAX */}
          <section className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-black text-amber-300 mb-2 flex items-center gap-2">
              👑 Gói Miễn Phí, VIP và MAX
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <span className="font-black text-amber-300 uppercase">Gói Miễn Phí</span>
                <p className="text-white/80 mt-1">Nền màu cam. Phòng chơi từ 2 - 6 người.</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40">
                <span className="font-black text-purple-300 uppercase">Gói VIP (Tím)</span>
                <p className="text-white/80 mt-1">
                  Nền màu tím. Phòng chơi từ 2 - 10 người. Mở khóa bằng 10 Kim Cương (3 ngày) hoặc 699.000đ/năm.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-amber-400">
                <span className="font-black text-amber-400 uppercase">Gói MAX (Đen)</span>
                <p className="text-white/80 mt-1">
                  Nền màu đen. Giá 1.299.000đ. Độc quyền: <strong>Trò chuyện Micro trực tiếp</strong> trong trận (Chỉ cần Host có MAX, cả phòng đều có micro).
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Linh Vật Ondice Cat */}
          <section className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-400/40">
            <h3 className="text-base font-black text-amber-300 mb-2 flex items-center gap-2">
              <span>🐾 Linh Vật Trò Chơi: Ondice Cat</span>
            </h3>
            <p className="leading-relaxed text-white/80">
              <strong>Ondice Cat</strong> là chú mèo đen may mắn mang vòng cổ xúc xắc vàng của trò chơi. Ondice Cat sẽ bất ngờ xuất hiện để cổ vũ những pha gieo bài xuất thần (Tứ Quý, Tam Quý, 4 số liên tiếp, Phản Công Rực Lửa), chúc mừng khi bạn ăn Tọa Điểm, hoặc an ủi khi bạn lỡ bước bỏ lượt. Bạn có thể bấm vào chú mèo bất kỳ lúc nào để vuốt ve hoặc xin quẻ may mắn!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
