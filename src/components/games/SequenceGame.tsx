import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, ArrowRight, Lightbulb, Volume2 } from 'lucide-react';
import { SequenceStep, SequenceQuestion, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface SequenceGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ topic, onFinish, onExit }) => {
  const sequences: SequenceQuestion[] = topic.sequences;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSteps, setCurrentSteps] = useState<SequenceStep[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);

  const currentQ = sequences[currentIndex];

  // Shuffle steps for current sequence
  useEffect(() => {
    if (currentQ) {
      const shuffled = [...currentQ.steps].sort(() => Math.random() - 0.5);
      setCurrentSteps(shuffled);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  }, [currentIndex, currentQ]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isAnswered) return;
    soundManager.playClick();
    const newSteps = [...currentSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setCurrentSteps(newSteps);
  };

  const handleCheckSequence = () => {
    // Check if sorted order 1, 2, 3...
    const right = currentSteps.every((step, idx) => step.order === idx + 1);

    setIsAnswered(true);
    setIsCorrect(right);

    if (right) {
      soundManager.playCorrect();
      setScoreCount((prev) => prev + 1);
      fireCelebrationConfetti();
    } else {
      soundManager.playWrong();
    }

    const correctOrderString = [...currentQ.steps]
      .sort((a, b) => a.order - b.order)
      .map((s, i) => `${i + 1}. ${s.text}`)
      .join(' ➔ ');

    const userOrderString = currentSteps
      .map((s, i) => `${i + 1}. ${s.text}`)
      .join(' ➔ ');

    const reviewItem: AnswerReviewItem = {
      question: `Susun Urutan: ${currentQ.title}`,
      userAnswerText: userOrderString,
      correctAnswerText: correctOrderString,
      isCorrect: right,
      explanation: currentQ.explanation,
    };
    setReviewItems((prev) => [...prev, reviewItem]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < sequences.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const finalCorrect = scoreCount;
      const total = sequences.length;
      const calculatedScore = Math.round((finalCorrect / total) * 100);
      onFinish(calculatedScore, finalCorrect, total, reviewItems);
    }
  };

  const speakInstruction = () => {
    soundManager.speakText(`${currentQ.title}. ${currentQ.instruction}`);
  };

  const progressPercent = Math.round(((currentIndex + 1) / sequences.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 font-black text-sm flex items-center justify-center">
              {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-500">
              dari {sequences.length} Siklus & Urutan
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
            Susun Urutan Tahapan
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Sequence Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg border-4 border-teal-200 space-y-5">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MascotAvatar size="sm" emotion={isAnswered ? (isCorrect ? 'cheering' : 'thinking') : 'happy'} />
            <div>
              <h3 className="text-sm font-black text-slate-800">{currentQ.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{currentQ.instruction}</p>
            </div>
          </div>
          <button
            onClick={speakInstruction}
            className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 border border-slate-200 transition-colors"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          {currentSteps.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === currentSteps.length - 1;

            let cardClass = 'bg-slate-50 border-slate-200';
            if (isAnswered) {
              cardClass = step.order === idx + 1
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950';
            }

            return (
              <div
                key={step.id}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${cardClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                    {step.text}
                  </span>
                </div>

                {!isAnswered && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={isFirst}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 shadow-xs cursor-pointer"
                      title="Geser Naik"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={isLast}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 shadow-xs cursor-pointer"
                      title="Geser Turun"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Check button */}
        {!isAnswered && (
          <button
            onClick={handleCheckSequence}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Periksa Urutan Langkah</span>
          </button>
        )}

        {/* Feedback & Next */}
        {isAnswered && (
          <div className="space-y-4 pt-2 animate-fade-in text-left">
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="font-black flex items-center gap-1.5 mb-1 text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Hebat Sekali! Urutannya Tepat Sempurna! 🎉</span>
                  </>
                ) : (
                  <>
                    <span>Urutan Belum Tepat. Simak Penjelasannya:</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700">{currentQ.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < sequences.length ? 'Urutan Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
