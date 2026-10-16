import React, { useState } from 'react';
import { Compass, Star, Lock, CheckCircle2, Play, Award, ChevronRight, ArrowLeft } from 'lucide-react';
import { MaterialTopic, GameMode } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { MascotAvatar } from '../common/EduIllustrations';
import { QuizGame } from './QuizGame';
import { TrueFalseGame } from './TrueFalseGame';
import { DragDropGame } from './DragDropGame';
import { GuessPictureGame } from './GuessPictureGame';
import { WordScrambleGame } from './WordScrambleGame';
import { AnswerReviewItem } from '../ResultScreen';

interface AdventureGameProps {
  topic: MaterialTopic;
  onFinishAdventure: (totalScore: number, stagesCompleted: number) => void;
  onExit: () => void;
}

interface QuestStage {
  id: number;
  title: string;
  description: string;
  mode: GameMode;
  icon: string;
  color: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
}

export const AdventureGame: React.FC<AdventureGameProps> = ({ topic, onFinishAdventure, onExit }) => {
  const [stages, setStages] = useState<QuestStage[]>([
    {
      id: 1,
      title: 'Pos 1: Observatorium Visual Matematika',
      description: 'Kenali bangun ruang kubus, balok, arsiran pecahan, dan diagram dari gambar visual.',
      mode: 'guess_picture',
      icon: '📐',
      color: 'from-emerald-400 to-teal-500',
      unlocked: true,
      completed: false,
      stars: 0,
    },
    {
      id: 2,
      title: 'Pos 2: Lembah Nalar Matematika',
      description: 'Uji ketelitianmu dalam membedakan kebenaran rumus pecahan, desimal, dan bangun ruang.',
      mode: 'true_false',
      icon: '⚖️',
      color: 'from-sky-400 to-blue-500',
      unlocked: false,
      completed: false,
      stars: 0,
    },
    {
      id: 3,
      title: 'Pos 3: Gudang Sortir Bilangan & Dimensi',
      description: 'Kelompokkan bilangan cacah, pecahan, desimal, dan unsur kubus/balok ke keranjang tepat.',
      mode: 'drag_drop',
      icon: '🧺',
      color: 'from-amber-400 to-orange-500',
      unlocked: false,
      completed: false,
      stars: 0,
    },
    {
      id: 4,
      title: 'Pos 4: Gua Sandi Istilah Matematika',
      description: 'Pecahkan huruf-huruf acak menjadi istilah penting (Desimal, Volume, Peluang, dsb).',
      mode: 'word_scramble',
      icon: '🧩',
      color: 'from-indigo-400 to-purple-500',
      unlocked: false,
      completed: false,
      stars: 0,
    },
    {
      id: 5,
      title: 'Pos 5: Puncak Master Matematika MI',
      description: 'Ujian pamungkas kuis pilihan ganda untuk membuktikan kepakaranmu meraih Bintang Emas!',
      mode: 'quiz',
      icon: '👑',
      color: 'from-rose-400 to-pink-500',
      unlocked: false,
      completed: false,
      stars: 0,
    },
  ]);

  const [activeStageId, setActiveStageId] = useState<number | null>(null);

  const handleStartStage = (stageId: number) => {
    soundManager.playClick();
    setActiveStageId(stageId);
  };

  const handleStageFinished = (score: number, correctCount: number, totalCount: number) => {
    if (activeStageId === null) return;

    const earnedStars = score >= 80 ? 3 : score >= 60 ? 2 : 1;

    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === activeStageId) {
          return {
            ...stage,
            completed: true,
            stars: Math.max(stage.stars, earnedStars),
          };
        }
        // Unlock next stage
        if (stage.id === activeStageId + 1) {
          return {
            ...stage,
            unlocked: true,
          };
        }
        return stage;
      })
    );

    setActiveStageId(null);
    soundManager.playVictory();
  };

  // If a subgame is currently active
  if (activeStageId !== null) {
    const currentStage = stages.find((s) => s.id === activeStageId)!;

    const wrapFinish = (score: number, correctCount: number, totalCount: number) => {
      handleStageFinished(score, correctCount, totalCount);
    };

    return (
      <div className="space-y-4">
        {/* Subgame back bar */}
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveStageId(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta Petualangan</span>
          </button>
          <div className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {currentStage.title}
          </div>
        </div>

        {currentStage.mode === 'guess_picture' && (
          <GuessPictureGame topic={topic} onFinish={wrapFinish} onExit={() => setActiveStageId(null)} />
        )}
        {currentStage.mode === 'true_false' && (
          <TrueFalseGame topic={topic} onFinish={wrapFinish} onExit={() => setActiveStageId(null)} />
        )}
        {currentStage.mode === 'drag_drop' && (
          <DragDropGame topic={topic} onFinish={wrapFinish} onExit={() => setActiveStageId(null)} />
        )}
        {currentStage.mode === 'word_scramble' && (
          <WordScrambleGame topic={topic} onFinish={wrapFinish} onExit={() => setActiveStageId(null)} />
        )}
        {currentStage.mode === 'quiz' && (
          <QuizGame topic={topic} onFinish={wrapFinish} onExit={() => setActiveStageId(null)} />
        )}
      </div>
    );
  }

  const completedCount = stages.filter((s) => s.completed).length;
  const totalAdventureStars = stages.reduce((acc, s) => acc + s.stars, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <MascotAvatar size="lg" emotion="cheering" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/30">
                Mode Petualangan Edukasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">Ekspedisi Pulau Pengetahuan</h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Tuntaskan kelima pos tantangan untuk meraih Medali Mahkota Juara!
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/40 flex items-center gap-4 text-center">
            <div>
              <span className="text-[10px] font-bold block text-amber-100">POS TUNTAS</span>
              <span className="text-xl font-black">{completedCount} / 5</span>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <span className="text-[10px] font-bold block text-amber-100">BINTANG</span>
              <span className="text-xl font-black flex items-center gap-1">
                ⭐ {totalAdventureStars}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Island Stages Map */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-500" />
          <span>Peta Rute Petualangan:</span>
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {stages.map((stage, idx) => {
            const isClickable = stage.unlocked;

            return (
              <div
                key={stage.id}
                onClick={() => isClickable && handleStartStage(stage.id)}
                className={`p-4 sm:p-5 rounded-3xl border-3 transition-all flex items-center justify-between gap-4 ${
                  !stage.unlocked
                    ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                    : stage.completed
                    ? 'bg-white hover:bg-emerald-50/50 border-emerald-300 shadow-sm cursor-pointer'
                    : 'bg-white hover:bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-100 cursor-pointer transform hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Stage Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm shrink-0 ${
                      !stage.unlocked
                        ? 'bg-slate-200 text-slate-400'
                        : `bg-gradient-to-br ${stage.color} text-white`
                    }`}
                  >
                    {!stage.unlocked ? <Lock className="w-6 h-6" /> : stage.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-800 text-sm sm:text-base">{stage.title}</h4>
                      {stage.completed && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{stage.description}</p>
                  </div>
                </div>

                {/* Stars and Action */}
                <div className="flex items-center gap-3 shrink-0">
                  {stage.unlocked && (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-5 h-5 ${
                            starIdx <= stage.stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {stage.unlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartStage(stage.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{stage.completed ? 'Main Ulang' : 'Mulai'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
