import React, { useEffect } from 'react';
import { RotateCcw, Home, Award, CheckCircle2, XCircle, Star, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { fireGrandCelebration } from '../utils/confetti';
import { MascotAvatar } from './common/EduIllustrations';

export interface AnswerReviewItem {
  question: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  explanation: string;
}

interface ResultScreenProps {
  score: number; // 0 - 100
  correctCount: number;
  totalCount: number;
  stars: number; // 1, 2, or 3
  topicTitle: string;
  modeTitle: string;
  reviewItems: AnswerReviewItem[];
  onRestart: () => void;
  onGoHome: () => void;
  newBadgeUnlocked?: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  correctCount,
  totalCount,
  stars,
  topicTitle,
  modeTitle,
  reviewItems,
  onRestart,
  onGoHome,
  newBadgeUnlocked,
}) => {
  const incorrectCount = totalCount - correctCount;

  useEffect(() => {
    if (score >= 70) {
      soundManager.playVictory();
      fireGrandCelebration();
    } else {
      soundManager.playCorrect();
    }
  }, [score]);

  // Encouraging feedback message tailored for elementary school students
  const getMotivationMessage = () => {
    if (score === 100) {
      return {
        title: 'LUAR BIASA SEMPURNA! 🌟🌟🌟',
        subtitle: 'Hebat sekali! Kamu menjawab semua tantangan dengan tepat tanpa cela!',
        avatarEmotion: 'cheering' as const,
        bgGradient: 'from-amber-400 via-yellow-400 to-amber-500',
        textColor: 'text-amber-950',
      };
    }
    if (score >= 80) {
      return {
        title: 'HEBAT SEKALI! BINTANG 3 ⭐⭐⭐',
        subtitle: 'Pemahamanmu tentang materi ini sudah sangat mantap dan membanggakan!',
        avatarEmotion: 'cheering' as const,
        bgGradient: 'from-emerald-400 via-teal-400 to-emerald-500',
        textColor: 'text-emerald-950',
      };
    }
    if (score >= 60) {
      return {
        title: 'BAGUS SEKALI! BINTANG 2 ⭐⭐',
        subtitle: 'Kerja bagus! Sedikit lagi latihan, kamu pasti bisa meraih nilai 100!',
        avatarEmotion: 'happy' as const,
        bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
        textColor: 'text-sky-950',
      };
    }
    return {
      title: 'PANTANG MENYERAH! BINTANG 1 ⭐',
      subtitle: 'Jangan berkecil hati, belajar adalah proses! Baca pembahasan di bawah dan coba lagi ya!',
      avatarEmotion: 'thinking' as const,
      bgGradient: 'from-orange-400 via-amber-400 to-yellow-500',
      textColor: 'text-orange-950',
    };
  };

  const motivation = getMotivationMessage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in space-y-6">
      {/* Top Victory Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${motivation.bgGradient} shadow-xl border-4 border-white text-center text-white relative overflow-hidden`}>
        {/* Decorative circle shapes */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <MascotAvatar size="lg" emotion={motivation.avatarEmotion} />

          <h2 className={`mt-3 text-2xl sm:text-3xl font-black ${motivation.textColor} tracking-tight drop-shadow-sm`}>
            {motivation.title}
          </h2>

          <p className="mt-1 text-sm sm:text-base text-white/95 font-semibold max-w-md">
            {motivation.subtitle}
          </p>

          {/* Stars Display */}
          <div className="flex items-center justify-center gap-2 my-4">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`transition-all transform ${
                  starIdx <= stars
                    ? 'scale-110 text-amber-200 fill-amber-300 drop-shadow-md'
                    : 'scale-90 text-white/40'
                }`}
              >
                <Star className="w-10 h-10 fill-current stroke-2" />
              </div>
            ))}
          </div>

          {/* New Badge Callout */}
          {newBadgeUnlocked && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 text-white font-black text-xs sm:text-sm animate-bounce-subtle">
              <Award className="w-5 h-5 text-amber-200 fill-amber-200" />
              <span>Lencana Baru Terbuka: {newBadgeUnlocked}!</span>
            </div>
          )}

          {/* Big Score Box */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-md shadow-lg text-slate-800 border-2 border-slate-100">
            <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              {topicTitle} • {modeTitle}
            </div>

            <div className="my-2 flex items-baseline justify-center gap-1">
              <span className="text-5xl sm:text-6xl font-black text-sky-600 tracking-tight">{score}</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-400">/ 100</span>
            </div>

            <div className="text-xs font-semibold text-slate-500 mb-4">
              Rumus: ({correctCount} Benar ÷ {totalCount} Soal) × 100
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Jawaban Benar</span>
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-0.5">{correctCount}</div>
              </div>

              <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
                <div className="flex items-center justify-center gap-1 text-rose-700 text-xs font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>Perlu Diperbaiki</span>
                </div>
                <div className="text-2xl font-black text-rose-600 mt-0.5">{incorrectCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-base shadow-lg transition-transform flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Ulangi Permainan Ini</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black text-base shadow-lg transition-transform flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>

      {/* Answer Review & Explanations (Pembahasan Materi Lengkap) */}
      {reviewItems && reviewItems.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sky-600" />
              <div>
                <h3 className="font-black text-slate-800 text-lg sm:text-xl">Ulasan & Kunci Pembahasan</h3>
                <p className="text-xs text-slate-500 font-medium">Pelajari kembali konsep agar makin paham dan pintar</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {reviewItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                      {item.question}
                    </h4>
                  </div>
                  <button
                    onClick={() => soundManager.speakText(`${item.question}. Kunci jawaban: ${item.correctAnswerText}. Pembahasan: ${item.explanation}`)}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-sky-600 border border-slate-200 shrink-0"
                    title="Dengarkan Pembahasan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 pl-8 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">Jawabanmu:</span>
                    <span
                      className={`font-black px-2 py-0.5 rounded-md ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 line-through'
                      }`}
                    >
                      {item.userAnswerText}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">Kunci Benar:</span>
                      <span className="font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {item.correctAnswerText}
                      </span>
                    </div>
                  )}

                  {/* Explanation text */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-sky-700">💡 Penjelasan: </span>
                    {item.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
