import React, { useState } from 'react';
import { Check, X, ArrowRight, Volume2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { TrueFalseQuestion, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface TrueFalseGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({ topic, onFinish, onExit }) => {
  const questions: TrueFalseQuestion[] = topic.trueFalseQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentQ.isTrue;
    if (isCorrect) {
      soundManager.playCorrect();
      setScoreCount((prev) => prev + 1);
      fireCelebrationConfetti();
    } else {
      soundManager.playWrong();
    }

    const reviewItem: AnswerReviewItem = {
      question: currentQ.statement,
      userAnswerText: choice ? 'BENAR' : 'SALAH',
      correctAnswerText: currentQ.isTrue ? 'BENAR' : 'SALAH',
      isCorrect,
      explanation: currentQ.explanation,
    };
    setReviewItems((prev) => [...prev, reviewItem]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserChoice(null);
      setIsAnswered(false);
    } else {
      const finalCorrect = scoreCount;
      const total = questions.length;
      const calculatedScore = Math.round((finalCorrect / total) * 100);
      onFinish(calculatedScore, finalCorrect, total, reviewItems);
    }
  };

  const speakStatement = () => {
    soundManager.speakText(`Pernyataan: ${currentQ.statement}. Apakah ini benar atau salah?`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Progress header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
              {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-500">
              dari {questions.length} Pernyataan
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            Benar atau Salah
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Statement Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg border-4 border-emerald-200 text-center space-y-6">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MascotAvatar
              size="sm"
              emotion={isAnswered ? (userChoice === currentQ.isTrue ? 'cheering' : 'thinking') : 'happy'}
            />
            <span className="text-xs font-bold text-slate-400 text-left">
              Fakta / Mitos Pendidikan
            </span>
          </div>
          <button
            onClick={speakStatement}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 transition-colors"
            title="Dengarkan Pernyataan"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Large Statement Quote Box */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-3xl border-2 border-emerald-100 relative">
          <span className="text-4xl text-emerald-200 font-serif absolute top-3 left-4 select-none">“</span>
          <p className="text-lg sm:text-2xl font-black text-slate-800 leading-snug px-4">
            {currentQ.statement}
          </p>
          <span className="text-4xl text-emerald-200 font-serif absolute bottom-2 right-4 select-none">”</span>
        </div>

        {/* Big Choice Buttons (BENAR vs SALAH) */}
        {!isAnswered ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleAnswer(true)}
              className="py-6 px-6 rounded-3xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg border-4 border-emerald-400 flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span>BENAR</span>
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="py-6 px-6 rounded-3xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg border-4 border-rose-400 flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <X className="w-8 h-8 stroke-[3]" />
              </div>
              <span>SALAH</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in text-left">
            <div
              className={`p-4 rounded-2xl border-2 text-sm leading-relaxed ${
                userChoice === currentQ.isTrue
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="font-black flex items-center gap-2 mb-1.5 text-base">
                {userChoice === currentQ.isTrue ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span>Tepat Sekali! Pernyataan ini memang {currentQ.isTrue ? 'BENAR' : 'SALAH'}! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <span>Kurang Tepat. Sebenarnya pernyataan ini adalah {currentQ.isTrue ? 'BENAR' : 'SALAH'}.</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700 pl-8">{currentQ.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Pernyataan Selanjutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
