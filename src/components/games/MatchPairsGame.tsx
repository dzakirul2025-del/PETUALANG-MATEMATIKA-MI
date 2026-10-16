import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { MatchPairItem, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface MatchPairsGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

export const MatchPairsGame: React.FC<MatchPairsGameProps> = ({ topic, onFinish, onExit }) => {
  const originalPairs = topic.matchPairs;
  const [selectedLeft, setSelectedLeft] = useState<MatchPairItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<MatchPairItem | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [rightItems, setRightItems] = useState<MatchPairItem[]>([]);
  const [wrongPairAnimation, setWrongPairAnimation] = useState(false);

  // Shuffle right side on load
  useEffect(() => {
    const shuffled = [...originalPairs].sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
  }, [topic]);

  const handleSelectLeft = (item: MatchPairItem) => {
    if (matchedKeys.includes(item.matchKey)) return;
    soundManager.playClick();
    setSelectedLeft(item);

    // If right was already chosen
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleSelectRight = (item: MatchPairItem) => {
    if (matchedKeys.includes(item.matchKey)) return;
    soundManager.playClick();
    setSelectedRight(item);

    // If left was already chosen
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left: MatchPairItem, right: MatchPairItem) => {
    if (left.matchKey === right.matchKey) {
      // Correct match!
      soundManager.playCorrect();
      fireCelebrationConfetti();
      const updated = [...matchedKeys, left.matchKey];
      setMatchedKeys(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs are matched
      if (updated.length === originalPairs.length) {
        setTimeout(() => {
          finishGame(updated.length, mistakes);
        }, 800);
      }
    } else {
      // Wrong match
      soundManager.playWrong();
      setMistakes((prev) => prev + 1);
      setWrongPairAnimation(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPairAnimation(false);
      }, 700);
    }
  };

  const finishGame = (totalMatched: number, mistakeCount: number) => {
    // Fair scoring: penalty-free high score base, 100 max minus minor mistake deductions min 60
    const rawScore = Math.max(60, 100 - mistakeCount * 5);
    const reviewItems: AnswerReviewItem[] = originalPairs.map((p) => ({
      question: `Pasangan untuk: "${p.left}"`,
      userAnswerText: p.right,
      correctAnswerText: p.right,
      isCorrect: true,
      explanation: `Konsep "${p.left}" berpasangan tepat dengan "${p.right}".`,
    }));

    onFinish(rawScore, totalMatched, originalPairs.length, reviewItems);
  };

  const matchedPercent = Math.round((matchedKeys.length / originalPairs.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <MascotAvatar size="sm" emotion={matchedKeys.length === originalPairs.length ? 'cheering' : 'happy'} />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Cocokkan Pasangan Konsep
              </span>
              <h3 className="text-xs text-slate-500 font-bold">{topic.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              Terhubung: <strong className="text-purple-600 font-black">{matchedKeys.length}</strong> / {originalPairs.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${matchedPercent}%` }}
          />
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs sm:text-sm text-purple-900 font-medium flex items-center justify-between">
        <span>👆 Klik satu kartu di kolom kiri, lalu klik pasangannya di kolom kanan!</span>
        {mistakes > 0 && (
          <span className="text-xs font-bold text-slate-500">Percobaan salah: {mistakes}</span>
        )}
      </div>

      {/* Matching Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column (Istilah / Konsep) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 px-2">
            Istilah / Konsep
          </h4>
          {originalPairs.map((pair) => {
            const isMatched = matchedKeys.includes(pair.matchKey);
            const isSelected = selectedLeft?.matchKey === pair.matchKey;

            return (
              <button
                key={pair.id}
                disabled={isMatched}
                onClick={() => handleSelectLeft(pair)}
                className={`w-full p-4 rounded-2xl border-2 font-black text-sm sm:text-base text-left transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-70 cursor-default'
                    : isSelected
                    ? wrongPairAnimation
                      ? 'bg-rose-100 border-rose-400 text-rose-800 animate-shake'
                      : 'bg-purple-600 border-purple-700 text-white shadow-md ring-2 ring-purple-300'
                    : 'bg-white hover:bg-purple-50 border-slate-200 text-slate-800 hover:border-purple-300 cursor-pointer'
                }`}
              >
                <span>{pair.left}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Column (Definisi / Contoh) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 px-2">
            Arti / Penjelasan
          </h4>
          {rightItems.map((pair) => {
            const isMatched = matchedKeys.includes(pair.matchKey);
            const isSelected = selectedRight?.matchKey === pair.matchKey;

            return (
              <button
                key={pair.id}
                disabled={isMatched}
                onClick={() => handleSelectRight(pair)}
                className={`w-full p-4 rounded-2xl border-2 font-medium text-xs sm:text-sm text-left transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-70 cursor-default'
                    : isSelected
                    ? wrongPairAnimation
                      ? 'bg-rose-100 border-rose-400 text-rose-800 animate-shake'
                      : 'bg-indigo-600 border-indigo-700 text-white shadow-md ring-2 ring-indigo-300'
                    : 'bg-white hover:bg-indigo-50 border-slate-200 text-slate-700 hover:border-indigo-300 cursor-pointer'
                }`}
              >
                <span>{pair.right}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
