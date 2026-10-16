import React, { useState, useMemo } from 'react';
import { HelpCircle, Lightbulb, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, Filter, Layers } from 'lucide-react';
import { QuizQuestion, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface QuizGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

type QuestionFilterType = 'all50' | '10' | '20' | '25' | 'sub_konversi' | 'sub_kali' | 'sub_bagi' | 'sub_cerita';

export const QuizGame: React.FC<QuizGameProps> = ({ topic, onFinish, onExit }) => {
  const [filterType, setFilterType] = useState<QuestionFilterType>('all50');

  // Filter questions based on selection
  const activeQuestions: QuizQuestion[] = useMemo(() => {
    const all = topic.quizQuestions;
    if (filterType === 'all50') return all;
    if (filterType === '10') return all.slice(0, 10);
    if (filterType === '20') return all.slice(0, 20);
    if (filterType === '25') return all.slice(0, 25);
    if (filterType === 'sub_konversi') return all.slice(0, 12); // Soal 1-12
    if (filterType === 'sub_kali') return all.slice(12, 25);    // Soal 13-25
    if (filterType === 'sub_bagi') return all.slice(25, 38);    // Soal 26-38
    if (filterType === 'sub_cerita') return all.slice(38, 50);  // Soal 39-50
    return all;
  }, [topic.quizQuestions, filterType]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];
  const progressPercent = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);

  const handleFilterChange = (newFilter: QuestionFilterType) => {
    soundManager.playClick();
    setFilterType(newFilter);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setScoreCount(0);
    setReviewItems([]);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      setScoreCount((prev) => prev + 1);
      fireCelebrationConfetti();
    } else {
      soundManager.playWrong();
    }

    // Record review item
    const reviewItem: AnswerReviewItem = {
      question: currentQ.question,
      userAnswerText: currentQ.options[index],
      correctAnswerText: currentQ.options[currentQ.correctAnswer],
      isCorrect,
      explanation: currentQ.explanation,
    };
    setReviewItems((prev) => [...prev, reviewItem]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Calculate final score = (correct / total) * 100
      const finalCorrect = scoreCount;
      const total = activeQuestions.length;
      const calculatedScore = Math.round((finalCorrect / total) * 100);
      onFinish(calculatedScore, finalCorrect, total, reviewItems);
    }
  };

  const speakQuestion = () => {
    const textToSpeak = `${currentQ.question}. Pilihan A: ${currentQ.options[0]}. Pilihan B: ${currentQ.options[1]}. Pilihan C: ${currentQ.options[2]}. Pilihan D: ${currentQ.options[3]}.`;
    soundManager.speakText(textToSpeak);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Session Length & Subtopic Filter Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Jumlah / Sesi Soal:</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => handleFilterChange('all50')}
              className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
                filterType === 'all50'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              50 Soal Lengkap 🏆
            </button>
            <button
              onClick={() => handleFilterChange('25')}
              className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
                filterType === '25'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              25 Soal
            </button>
            <button
              onClick={() => handleFilterChange('10')}
              className={`px-2.5 py-1 rounded-lg font-black transition-colors ${
                filterType === '10'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              10 Soal
            </button>
          </div>
        </div>

        {/* Subtopic Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 overflow-x-auto text-[11px] font-semibold text-slate-600">
          <span className="shrink-0 text-slate-400 font-bold">Subtopik:</span>
          <button
            onClick={() => handleFilterChange('sub_konversi')}
            className={`shrink-0 px-2 py-0.5 rounded-md transition-colors ${
              filterType === 'sub_konversi' ? 'bg-amber-100 text-amber-900 font-black border border-amber-300' : 'hover:bg-slate-100'
            }`}
          >
            1. Konversi (12 Soal)
          </button>
          <button
            onClick={() => handleFilterChange('sub_kali')}
            className={`shrink-0 px-2 py-0.5 rounded-md transition-colors ${
              filterType === 'sub_kali' ? 'bg-amber-100 text-amber-900 font-black border border-amber-300' : 'hover:bg-slate-100'
            }`}
          >
            2. Perkalian (13 Soal)
          </button>
          <button
            onClick={() => handleFilterChange('sub_bagi')}
            className={`shrink-0 px-2 py-0.5 rounded-md transition-colors ${
              filterType === 'sub_bagi' ? 'bg-amber-100 text-amber-900 font-black border border-amber-300' : 'hover:bg-slate-100'
            }`}
          >
            3. Pembagian (13 Soal)
          </button>
          <button
            onClick={() => handleFilterChange('sub_cerita')}
            className={`shrink-0 px-2 py-0.5 rounded-md transition-colors ${
              filterType === 'sub_cerita' ? 'bg-amber-100 text-amber-900 font-black border border-amber-300' : 'hover:bg-slate-100'
            }`}
          >
            4. Soal Cerita (12 Soal)
          </button>
        </div>
      </div>

      {/* Top Header & Progress */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shadow-xs">
              {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-600">
              dari <strong className="text-emerald-700">{activeQuestions.length}</strong> Soal Pecahan & Desimal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Nilai Sementara:</span>
            <span className="text-sm sm:text-base font-black px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
              {Math.round((scoreCount / activeQuestions.length) * 100)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border-4 border-emerald-200 space-y-5 relative">
        {/* Mascot & Topic Badge */}
        <div className="flex items-center justify-between gap-2 border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MascotAvatar size="sm" emotion={isAnswered ? (selectedOption === currentQ.correctAnswer ? 'cheering' : 'thinking') : 'happy'} />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Kuis Cepat Matematika MI
              </span>
              <h3 className="text-xs text-slate-500 font-bold">{topic.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentQ.hint && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(!showHint);
                }}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                  showHint
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-amber-50'
                }`}
                title="Petunjuk Jawaban"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Petunjuk</span>
              </button>
            )}

            <button
              onClick={speakQuestion}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && currentQ.hint && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-2 animate-fade-in font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong className="font-bold">Petunjuk Guru: </strong> {currentQ.hint}
            </span>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-base sm:text-xl font-black text-slate-800 leading-snug">
          {currentQ.question}
        </h2>

        {/* 4 Large Option Buttons (A, B, C, D) */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {currentQ.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            let buttonClass = 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-700';

            if (isAnswered) {
              if (idx === currentQ.correctAnswer) {
                // Correct answer (Green)
                buttonClass = 'bg-emerald-600 border-emerald-700 text-white shadow-md ring-2 ring-emerald-300';
              } else if (idx === selectedOption) {
                // User picked wrong (Red)
                buttonClass = 'bg-rose-500 border-rose-600 text-white shadow-md';
              } else {
                buttonClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (selectedOption === idx) {
              buttonClass = 'bg-emerald-100 border-emerald-400 text-emerald-900';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-3 transition-all active:scale-[0.99] cursor-pointer disabled:cursor-default ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isAnswered && idx === currentQ.correctAnswer
                        ? 'bg-emerald-700 text-white'
                        : isAnswered && idx === selectedOption
                        ? 'bg-rose-700 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {isAnswered && idx === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                  <XCircle className="w-6 h-6 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Section */}
        {isAnswered && (
          <div className="space-y-4 pt-2 animate-fade-in">
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
                    <span>Jawaban Tepat Sekali! 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Belum Tepat, Ini Pembahasan Ilmiahnya:</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700">{currentQ.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < activeQuestions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
