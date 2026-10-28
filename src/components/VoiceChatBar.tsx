import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Radio, Lock, Sparkles } from 'lucide-react';
import { Player, TierType } from '../types/ondice';

interface VoiceChatBarProps {
  currentTier: TierType;
  hostTier: TierType;
  players: Player[];
  onUpgradeToMax: () => void;
}

export const VoiceChatBar: React.FC<VoiceChatBarProps> = ({
  currentTier,
  hostTier,
  players,
  onUpgradeToMax,
}) => {
  const isMaxRoom = hostTier === 'max' || currentTier === 'max';
  const [isMicActive, setIsMicActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup streams when unmounting
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const toggleMic = async () => {
    if (!isMaxRoom) return;

    if (isMicActive) {
      // Turn off
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setIsMicActive(false);
      setVolumeLevel(0);
    } else {
      // Turn on
      try {
        setErrorMessage(null);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        setIsMicActive(true);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      } catch (err) {
        console.warn('Microphone access:', err);
        setErrorMessage('Không thể truy cập Micro (kiểm tra quyền trình duyệt).');
        setIsMicActive(false);
      }
    }
  };

  if (!isMaxRoom) {
    return (
      <div className="w-full max-w-4xl mx-auto my-2 px-3 py-2 rounded-xl bg-black/30 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-white/70">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>
            <strong className="text-amber-300">Đặc Quyền MAX:</strong> Trò chuyện Micro trực tiếp trong trận đấu (Chỉ cần Host có MAX, cả phòng đều được bật Micro).
          </span>
        </div>
        <button
          onClick={onUpgradeToMax}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-bold rounded-lg transition-transform hover:scale-105"
        >
          <Lock className="w-3 h-3 text-neutral-950" />
          <span>Gói MAX (Tạm Khóa Thanh Toán)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-2 px-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-amber-400/40 backdrop-blur-lg flex flex-wrap items-center justify-between gap-3 text-white shadow-xl shadow-black/40">
      {/* Mic Status & Control */}
      <div className="flex items-center gap-3">
        <button
          id="ondice-btn-mic-toggle"
          onClick={toggleMic}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md ${
            isMicActive
              ? 'bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-400/50 animate-pulse'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white/90 border border-white/10'
          }`}
        >
          {isMicActive ? (
            <>
              <Mic className="w-4 h-4 text-white" />
              <span>Đang Bật Micro</span>
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 text-neutral-400" />
              <span>Bật Micro (MAX)</span>
            </>
          )}
        </button>

        {/* Live Audio Level Meter */}
        {isMicActive && (
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="w-24 h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/10 flex items-center">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 rounded-full transition-all duration-75"
                style={{ width: `${Math.max(6, volumeLevel)}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {volumeLevel > 15 ? 'Đang nói...' : 'Sẵn sàng'}
            </span>
          </div>
        )}

        {errorMessage && (
          <span className="text-[11px] text-red-400 font-medium">{errorMessage}</span>
        )}
      </div>

      {/* Room Voice Channel Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          Kênh Thoại MAX Đang Hoạt Động
        </span>
        <div className="flex items-center -space-x-1.5">
          {players.slice(0, 5).map((p, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center font-bold relative ${
                p.isSpeaking || (p.id === 'player_1' && isMicActive && volumeLevel > 20)
                  ? 'border-emerald-400 bg-emerald-600 ring-2 ring-emerald-400 animate-bounce'
                  : 'border-neutral-800 bg-neutral-700 text-white/80'
              }`}
              title={`${p.name}: ${p.isSpeaking ? 'Đang nói' : 'Trực tuyến'}`}
            >
              {p.name.slice(0, 1)}
            </div>
          ))}
          {players.length > 5 && (
            <div className="w-6 h-6 rounded-full border-2 border-neutral-800 bg-neutral-800 text-[9px] text-white/60 flex items-center justify-center font-bold">
              +{players.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
