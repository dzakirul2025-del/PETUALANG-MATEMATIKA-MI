import React, { useState } from 'react';
import { Play, HelpCircle, CheckCircle, Layers, Image, Shuffle, ArrowDownUp, Compass, BookOpen, ChevronRight, Calendar, School, Calculator } from 'lucide-react';
import { GameMode, MaterialTopic } from '../types/game';
import { soundManager } from '../utils/audio';
import { MascotAvatar } from './common/EduIllustrations';

interface HomeHeroProps {
  topics: MaterialTopic[];
  selectedTopic: MaterialTopic;
  onSelectTopic: (topicId: string) => void;
  onStartGame: (mode: GameMode) => void;
  onOpenInstructions: () => void;
  onOpenTeacherMode: () => void;
  onOpenDeveloperInfo: () => void;
  totalStars: number;
  unlockedBadgeCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
  onStartGame,
  onOpenInstructions,
  onOpenTeacherMode,
  onOpenDeveloperInfo,
  totalStars,
  unlockedBadgeCount,
}) => {
  const [semesterFilter, setSemesterFilter] = useState<'semua' | 'ganjil' | 'genap'>('semua');

  const filteredTopics = topics.filter((t) => {
    if (semesterFilter === 'semua') return true;
    if (semesterFilter === 'ganjil') return t.semester?.includes('Ganjil');
    if (semesterFilter === 'genap') return t.semester?.includes('Genap');
    return true;
  });

  const gameModes: {
    mode: GameMode;
    title: string;
    subtitle: string;
    badge: string;
    color: string;
    icon: React.ReactNode;
    bgAccent: string;
  }[] = [
    {
      mode: 'quiz',
      title: 'Kuis Cepat Pilihan Ganda',
      subtitle: '10 tantangan matematika berbobot dengan pembahasan',
      badge: 'Favorit',
      color: 'from-sky-400 to-blue-500',
      bgAccent: 'hover:border-sky-400 hover:bg-sky-50/50',
      icon: <HelpCircle className="w-7 h-7 text-sky-500" />,
    },
    {
      mode: 'true_false',
      title: 'Benar atau Salah',
      subtitle: 'Uji nalar sifat rumus, bilangan, dan konsep matematika',
      badge: 'Cepat & Tepat',
      color: 'from-emerald-400 to-teal-500',
      bgAccent: 'hover:border-emerald-400 hover:bg-emerald-50/50',
      icon: <CheckCircle className="w-7 h-7 text-emerald-500" />,
    },
    {
      mode: 'match_pairs',
      title: 'Cocokkan Pasangan',
      subtitle: 'Hubungkan rumus & pecahan dengan desimal / hasilnya',
      badge: 'Asah Ingatan',
      color: 'from-purple-400 to-indigo-500',
      bgAccent: 'hover:border-purple-400 hover:bg-purple-50/50',
      icon: <Layers className="w-7 h-7 text-purple-500" />,
    },
    {
      mode: 'drag_drop',
      title: 'Drag & Drop Pengelompokan',
      subtitle: 'Kelompokkan bilangan atau unsur bangun ke keranjang',
      badge: 'Interaktif',
      color: 'from-amber-400 to-orange-500',
      bgAccent: 'hover:border-amber-400 hover:bg-amber-50/50',
      icon: <Layers className="w-7 h-7 text-amber-500" />,
    },
    {
      mode: 'guess_picture',
      title: 'Tebak Gambar & Geometri',
      subtitle: 'Amati visual bangun ruang, lingkaran & diagram',
      badge: 'Visual Nalar',
      color: 'from-rose-400 to-pink-500',
      bgAccent: 'hover:border-rose-400 hover:bg-rose-50/50',
      icon: <Image className="w-7 h-7 text-rose-500" />,
    },
    {
      mode: 'word_scramble',
      title: 'Susun Kata Matematika',
      subtitle: 'Rangkai istilah matematika (Diameter, Median, Modus, dsb.)',
      badge: 'Kosakata',
      color: 'from-indigo-400 to-violet-500',
      bgAccent: 'hover:border-indigo-400 hover:bg-indigo-50/50',
      icon: <Shuffle className="w-7 h-7 text-indigo-500" />,
    },
    {
      mode: 'sequence',
      title: 'Susun Urutan Langkah',
      subtitle: 'Urutkan tahapan pengerjaan rumus atau garis bilangan',
      badge: 'Logika Prosedur',
      color: 'from-teal-400 to-emerald-500',
      bgAccent: 'hover:border-teal-400 hover:bg-teal-50/50',
      icon: <ArrowDownUp className="w-7 h-7 text-teal-500" />,
    },
    {
      mode: 'adventure',
      title: 'Petualangan Matematika MI',
      subtitle: 'Jelajahi 5 pos pulau pengetahuan matematika berantai',
      badge: 'Misi Juara',
      color: 'from-amber-500 to-yellow-500',
      bgAccent: 'hover:border-amber-500 hover:bg-amber-50/50',
      icon: <Compass className="w-7 h-7 text-amber-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Top Identity & Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-10 shadow-xl border-4 border-emerald-300 overflow-hidden text-white">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-black text-emerald-100 shadow-sm">
              <School className="w-3.5 h-3.5" />
              <span>Madrasah Ibtidaiyah (MI)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-sm">
              <Calculator className="w-3.5 h-3.5" />
              <span>Matematika Kelas 6 • Fase C</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-black text-white shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>Semester Ganjil & Genap</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Petualangan Matematika Ceria MI! 📐
          </h1>

          <p className="text-sm sm:text-base font-semibold text-emerald-50 leading-relaxed">
            Media game edukasi interaktif Matematika Kelas 6 (Fase C) Kurikulum Merdeka. Kuasai pecahan, rasio, geometri lingkaran, bangun ruang, hingga statistika data dengan penuh percaya diri!
          </p>

          {/* Developer Attribution Card */}
          <div className="inline-flex items-center gap-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/30">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
              DH
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                Pengembang Aplikasi:
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                Dzakirul Husni, S.Pd.
              </span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenDeveloperInfo();
              }}
              className="ml-2 text-[11px] font-extrabold text-amber-300 hover:text-white underline underline-offset-2"
            >
              Lihat Profil
            </button>
          </div>

          {/* Quick Play CTA & Stats */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onStartGame('adventure');
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-sm sm:text-base shadow-lg transition-transform flex items-center gap-2 cursor-pointer border-2 border-amber-300"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>MULAI PETUALANGAN MATEMATIKA</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenInstructions();
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-md transition-transform flex items-center gap-2 cursor-pointer border border-white/40"
            >
              <HelpCircle className="w-5 h-5 text-amber-300" />
              <span>Petunjuk Bermain</span>
            </button>
          </div>
        </div>

        {/* Mascot in Hero Banner */}
        <div className="hidden md:flex absolute right-8 bottom-4 items-end gap-3 z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-white/60 text-xs font-extrabold text-slate-800 mb-6">
            Halo sahabat MI! <br />Ayo taklukkan Matematika bersama Kiko! 🧮
          </div>
          <MascotAvatar size="lg" emotion="happy" />
        </div>
      </div>

      {/* Subject and Chapter Selector */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Langkah 1</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Pilih Bab Matematika Kelas 6 MI
            </h2>
          </div>

          {/* Semester Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setSemesterFilter('semua');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                semesterFilter === 'semua'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Bab
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSemesterFilter('ganjil');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                semesterFilter === 'ganjil'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sem. Ganjil
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setSemesterFilter('genap');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                semesterFilter === 'genap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sem. Genap
            </button>
          </div>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredTopics.map((topic) => {
            const isSelected = topic.id === selectedTopic.id;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectTopic(topic.id);
                }}
                className={`p-4 rounded-2xl border-3 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-100 shadow-sm'
                    : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {topic.semester}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Aktif ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-800 text-base leading-snug">{topic.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{topic.chapter}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-emerald-700 font-extrabold">{topic.quizQuestions.length} Soal Kuis</span>
                  <span>{topic.grade}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Topic Objectives Details */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Tujuan Pembelajaran ({selectedTopic.title} - {selectedTopic.semester}):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 font-medium pl-2">
            {selectedTopic.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-black">•</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Mode Selection Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600">Langkah 2</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Pilih Mode Tantangan Matematika
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Tersedia 8 format permainan edukasi interaktif untuk menguji pemahaman konsep matematis siswa MI!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameModes.map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                soundManager.playClick();
                onStartGame(item.mode);
              }}
              className={`p-5 rounded-3xl bg-white border-3 border-slate-200 text-left transition-all active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[170px] ${item.bgAccent} group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-black text-slate-800 text-base group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>Mainkan Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
