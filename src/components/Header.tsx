import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Award, HelpCircle, PlusCircle, Home, UserCheck, Music, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { bgMusicManager } from '../utils/music';
import { MascotAvatar } from './common/EduIllustrations';

interface HeaderProps {
  currentScreen: string;
  onGoHome: () => void;
  onOpenInstructions: () => void;
  onOpenBadges: () => void;
  onOpenCustomMateri: () => void;
  onOpenDeveloperInfo: () => void;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  musicPlaying: boolean;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onToggleMusic: () => void;
  unlockedBadgeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onGoHome,
  onOpenInstructions,
  onOpenBadges,
  onOpenCustomMateri,
  onOpenDeveloperInfo,
  soundEnabled,
  voiceEnabled,
  musicPlaying,
  onToggleSound,
  onToggleVoice,
  onToggleMusic,
  unlockedBadgeCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-emerald-300 px-4 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2.5 text-left group hover:scale-[1.01] transition-transform"
        >
          <MascotAvatar size="sm" emotion="happy" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-base sm:text-xl text-emerald-700 tracking-tight">Matematika</span>
              <span className="font-extrabold text-base sm:text-xl text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">MI Kelas 6</span>
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md hidden lg:inline-block border border-emerald-200">
                Fase C • Sem. Ganjil & Genap
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Pengembang: <span className="font-bold text-emerald-700">Dzakirul Husni, S.Pd.</span>
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Home button if not on home */}
          {currentScreen !== 'home' && (
            <button
              onClick={() => {
                soundManager.playClick();
                onGoHome();
              }}
              title="Kembali ke Beranda"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Beranda</span>
            </button>
          )}

          {/* Developer Info Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDeveloperInfo();
            }}
            title="Profil Pengembang & Kurikulum MI"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">Dzakirul Husni, S.Pd.</span>
            <span className="lg:hidden">Info Guru</span>
          </button>


          {/* Background Music Playlist Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMusic();
            }}
            title={
              musicPlaying
                ? `Jeda Lagu: ${bgMusicManager.getCurrentTrack().title} (${bgMusicManager.getCurrentTrack().artist})`
                : `Putar Musik: ${bgMusicManager.getCurrentTrack().title}`
            }
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              musicPlaying
                ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:text-slate-600'
            }`}
          >
            {musicPlaying ? (
              <span className="text-xs">{bgMusicManager.getCurrentTrack().coverEmoji}</span>
            ) : (
              <Music className="w-4 h-4" />
            )}
            <span className="text-[11px] font-black hidden xl:inline max-w-[130px] truncate">
              {musicPlaying ? bgMusicManager.getCurrentTrack().title : 'Musik'}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Indonesian Voice Reader Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleVoice();
            }}
            title={voiceEnabled ? 'Suara Narator Aktif' : 'Nyalakan Narator Soal'}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Badge Gallery */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenBadges();
            }}
            title="Koleksi Lencana Penghargaan"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <Award className="w-4 h-4 text-amber-200 fill-amber-200" />
            <span>{unlockedBadgeCount}</span>
            <span className="hidden md:inline">Lencana</span>
          </button>

          {/* Mode Guru / Buat Materi */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCustomMateri();
            }}
            title="Kelola & Buat Materi Pelajaran Sendiri"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-purple-200" />
            <span>Mode Guru</span>
          </button>

          {/* Petunjuk Bermain */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenInstructions();
            }}
            title="Petunjuk & Cara Bermain"
            className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-300 font-bold transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
