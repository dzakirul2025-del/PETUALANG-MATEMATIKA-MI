import React from 'react';
import { X, Award, Sparkles, Atom, Calculator, Shield, Layers, Lock, CheckCircle2 } from 'lucide-react';
import { Badge } from '../types/game';
import { soundManager } from '../utils/audio';

interface BadgeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  totalStars: number;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ isOpen, onClose, badges, totalStars }) => {
  if (!isOpen) return null;

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = `w-8 h-8 ${unlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Award':
        return <Award className={iconClass} />;
      case 'Atom':
        return <Atom className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Shield':
        return <Shield className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-5 flex items-center justify-between border-b-4 border-amber-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">Papan Lencana Prestasi</h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Koleksi bintang dan medali belajarmu
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white font-bold transition-transform active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status bar */}
        <div className="bg-amber-50 p-4 border-b border-amber-200 flex items-center justify-around text-center">
          <div>
            <span className="text-xs text-amber-800 font-bold block">TOTAL BINTANG</span>
            <div className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
              <span>⭐</span>
              <span>{totalStars}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div>
            <span className="text-xs text-amber-800 font-bold block">LENCANA TERBUKA</span>
            <div className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
              <span>🎖️</span>
              <span>{unlockedCount} / {badges.length}</span>
            </div>
          </div>
        </div>

        {/* Badge list */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50/50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  badge.unlocked
                    ? 'bg-amber-100 border-2 border-amber-300 shadow-inner'
                    : 'bg-slate-200 border-2 border-slate-300'
                }`}
              >
                {badge.unlocked ? (
                  renderBadgeIcon(badge.icon, true)
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-sm">{badge.title}</h4>
                  {badge.unlocked && (
                    <span className="text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{badge.description}</p>
                {badge.unlocked && (
                  <span className="inline-block mt-1.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Tercapai ✨
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-sm shadow-md transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
