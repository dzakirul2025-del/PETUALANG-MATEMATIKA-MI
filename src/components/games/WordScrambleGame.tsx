import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, CheckCircle2, ArrowRight, Lightbulb, Volume2 } from 'lucide-react';
import { WordScrambleQuestion, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface WordScrambleGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

interface LetterTile {
  id: string;
  char: string;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ topic, onFinish, onExit }) => {
  const scrambles: WordScrambleQuestion[] = topic.wordScrambles;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableTiles, setAvailableTiles] = useState<LetterTile[]>([]);
  const [placedTiles, setPlacedTiles] = useState<LetterTile[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [reviewItems, setReviewItems] = useState<AnswerReviewItem[]>([]);

  const currentQ = scrambles[currentIndex];
  const targetWord = currentQ.word.toUpperCase();

  // Initialize and shuffle letters for the current word
  useEffect(() => {
    const chars = targetWord.split('');
    const tiles: LetterTile[] = chars.map((char, index) => ({
      id: `${char}-${index}-${Date.now()}`,
      char,
    }));
    // Shuffle
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
    setPlacedTiles([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentIndex, targetWord]);

  const handlePickTile = (tile: LetterTile) => {
    if (isAnswered) return;
    soundManager.playClick();
    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setPlacedTiles((prev) => [...prev, tile]);
  };

  const handleReturnTile = (tile: LetterTile) => {
    if (isAnswered) return;
    soundManager.playClick();
    setPlacedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleReset = () => {
    soundManager.playClick();
    setAvailableTiles([...availableTiles, ...placedTiles].sort(() => Math.random() - 0.5));
    setPlacedTiles([]);
  };

  const handleCheckAnswer = () => {
    const constructedWord = placedTiles.map((t) => t.char).join('');
    const right = constructedWord === targetWord;

    setIsAnswered(true);
    setIsCorrect(right);

    if (right) {
      soundManager.playCorrect();
      setScoreCount((prev) => prev + 1);
      fireCelebrationConfetti();
    } else {
      soundManager.playWrong();
    }

    const reviewItem: AnswerReviewItem = {
      question: `Susun Kata: ${currentQ.hint}`,
      userAnswerText: constructedWord || '(Kosong)',
      correctAnswerText: targetWord,
      isCorrect: right,
      explanation: `${currentQ.description} Kata yang tepat adalah "${targetWord}".`,
    };
    setReviewItems((prev) => [...prev, reviewItem]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < scrambles.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const finalCorrect = scoreCount;
      const total = scrambles.length;
      const calculatedScore = Math.round((finalCorrect / total) * 100);
      onFinish(calculatedScore, finalCorrect, total, reviewItems);
    }
  };

  const speakHint = () => {
    soundManager.speakText(`Petunjuk susun kata: ${currentQ.hint}`);
  };

  const progressPercent = Math.round(((currentIndex + 1) / scrambles.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
              {currentIndex + 1}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-500">
              dari {scrambles.length} Kata Ilmiah
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
            Susun Kata Rahasia
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg border-4 border-indigo-200 space-y-6 text-center">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <MascotAvatar size="sm" emotion={isAnswered ? (isCorrect ? 'cheering' : 'thinking') : 'happy'} />
            <span className="text-xs font-bold text-slate-400 text-left">
              {currentQ.category}
            </span>
          </div>
          <button
            onClick={speakHint}
            className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Clue Box */}
        <div className="p-4 sm:p-6 bg-indigo-50/70 rounded-3xl border-2 border-indigo-100 text-indigo-950 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-extrabold text-indigo-600">
            <Lightbulb className="w-4 h-4" />
            <span>Petunjuk Kata</span>
          </div>
          <p className="text-base sm:text-xl font-black">{currentQ.hint}</p>
        </div>

        {/* Answer Slots / Placed Letters */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Susunan Huruf Jawabanmu:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[64px] p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
            {Array.from({ length: targetWord.length }).map((_, slotIdx) => {
              const tile = placedTiles[slotIdx];
              return (
                <div
                  key={slotIdx}
                  onClick={() => tile && handleReturnTile(tile)}
                  className={`w-11 h-12 sm:w-13 sm:h-14 rounded-2xl border-2 flex items-center justify-center font-black text-lg sm:text-xl transition-all ${
                    tile
                      ? isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                          : 'bg-rose-500 border-rose-600 text-white shadow-sm'
                        : 'bg-indigo-600 border-indigo-700 text-white cursor-pointer hover:bg-indigo-700 shadow-md transform hover:-translate-y-0.5'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {tile ? tile.char : '_'}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">
            {placedTiles.length > 0 && !isAnswered && '👆 Klik huruf yang sudah terpasang jika ingin membatalkannya'}
          </p>
        </div>

        {/* Available Pool of Letter Tiles */}
        {!isAnswered && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Pilihan Huruf Acak:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handlePickTile(tile)}
                  className="w-12 h-13 sm:w-14 sm:h-15 rounded-2xl bg-white hover:bg-indigo-50 border-3 border-indigo-200 text-indigo-900 hover:border-indigo-400 font-black text-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {tile.char}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                disabled={placedTiles.length === 0}
                className="py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Susunan</span>
              </button>

              <button
                onClick={handleCheckAnswer}
                disabled={placedTiles.length !== targetWord.length}
                className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Periksa Kata</span>
              </button>
            </div>
          </div>
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
                    <span>Hebat! Kata yang kamu susun benar: &quot;{targetWord}&quot;! 🎉</span>
                  </>
                ) : (
                  <>
                    <span>Kata yang tepat adalah: <strong>&quot;{targetWord}&quot;</strong></span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700">{currentQ.description}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < scrambles.length ? 'Kata Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
