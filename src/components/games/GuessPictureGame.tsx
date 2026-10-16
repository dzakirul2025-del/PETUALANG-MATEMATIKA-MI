import React, { useState } from 'react';
import { Image, CheckCircle2, XCircle, ArrowRight, Volume2 } from 'lucide-react';
import { GuessPictureQuestion, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { EduIllustration, MascotAvatar } from '../common/EduIllustrations';

interface GuessPictureGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

export const GuessPictureGame: React.FC<GuessPictureGameProps> = ({ topic, onFinish, onExit }) => {
  const questions: GuessPictureQuestion[] = topic.guessPictures;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      setScoreCount((prev) => prev + 1);
      fireCelebrationConfetti();
    } else {
      soundManager.playWrong();
    }

    const reviewItem: AnswerReviewItem = {
      question: `[Tebak Gambar] ${currentQ.question}`,
      userAnswerText: currentQ.options[idx],
      correctAnswerText: currentQ.options[currentQ.correctAnswer],
      isCorrect,
      explanation: currentQ.explanation,
    };
    setReviewItems((prev) => [...prev, reviewItem]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalCorrect = scoreCount;
      const total = questions.length;
      const calculatedScore = Math.round((finalCorrect / total) * 100);
      onFinish(calculatedScore, finalCorrect, total, reviewItems);
    }
  };

  const speakQuestion = () => {
    soundManager.speakText(`Tebak Gambar: ${currentQ.question}. Pilihan jawaban: ${currentQ.options.join(', ')}.`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Progress header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center">
              {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-500">
              dari {questions.length} Gambar Edukasi
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
            Tebak Gambar & Simbol
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Picture Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg border-4 border-rose-200 space-y-5 text-center">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MascotAvatar
              size="sm"
              emotion={isAnswered ? (selectedOption === currentQ.correctAnswer ? 'cheering' : 'thinking') : 'happy'}
            />
            <h3 className="text-xs sm:text-sm font-black text-slate-700 text-left">{currentQ.title}</h3>
          </div>
          <button
            onClick={speakQuestion}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
            title="Dengarkan Soal"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center SVG Illustration */}
        <div className="py-2 flex justify-center">
          <div className="p-3 bg-gradient-to-b from-rose-50/50 to-amber-50/50 rounded-3xl border-2 border-rose-100 shadow-inner inline-block">
            <EduIllustration type={currentQ.svgType} className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-sm" />
          </div>
        </div>

        {/* Question Text */}
        <p className="text-base sm:text-lg font-black text-slate-800 leading-snug">
          {currentQ.question}
        </p>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {currentQ.options.map((opt, idx) => {
            let btnClass = 'bg-slate-50 hover:bg-rose-50/50 border-slate-200 text-slate-700';
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) {
                btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-2 ring-emerald-300';
              } else if (idx === selectedOption) {
                btnClass = 'bg-rose-500 border-rose-600 text-white shadow-md';
              } else {
                btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-2xl border-2 font-black text-sm sm:text-base flex items-center justify-between transition-all active:scale-[0.98] ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                  <XCircle className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation and Next */}
        {isAnswered && (
          <div className="space-y-4 pt-2 animate-fade-in text-left">
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="font-black flex items-center gap-1.5 mb-1 text-sm">
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Tepat Sekali! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Belum Tepat, Ini Penjelasannya:</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700">{currentQ.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Lanjut ke Gambar Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
