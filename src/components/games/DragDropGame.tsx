import React, { useState } from 'react';
import { Layers, CheckCircle2, Box, Droplet, Wind, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { DragDropItem, DragDropCategory, MaterialTopic } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { fireCelebrationConfetti } from '../../utils/confetti';
import { AnswerReviewItem } from '../ResultScreen';
import { MascotAvatar } from '../common/EduIllustrations';

interface DragDropGameProps {
  topic: MaterialTopic;
  onFinish: (score: number, correctCount: number, totalCount: number, review: AnswerReviewItem[]) => void;
  onExit: () => void;
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ topic, onFinish, onExit }) => {
  const { categories, items } = topic.dragDrop;
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<{ [itemId: string]: string }>({}); // itemId -> categoryId
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Remaining unplaced items
  const unplacedItems = items.filter((item) => !placedItems[item.id]);

  const handleSelectItem = (item: DragDropItem) => {
    soundManager.playClick();
    setSelectedItemId(item.id);
    setFeedbackMessage(null);
  };

  const handlePlaceIntoCategory = (catId: string) => {
    if (!selectedItemId) return;
    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    soundManager.playClick();
    const updated = { ...placedItems, [selectedItemId]: catId };
    setPlacedItems(updated);
    setSelectedItemId(null);

    // Check if all placed
    if (Object.keys(updated).length === items.length) {
      soundManager.playCorrect();
      fireCelebrationConfetti();
      setIsCompleted(true);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    soundManager.playClick();
    const updated = { ...placedItems };
    delete updated[itemId];
    setPlacedItems(updated);
    setIsCompleted(false);
  };

  const handleFinalSubmit = () => {
    // Check correctness
    let correct = 0;
    const reviewItems: AnswerReviewItem[] = items.map((item) => {
      const userCatId = placedItems[item.id];
      const correctCat = categories.find((c) => c.id === item.categoryId);
      const userCat = categories.find((c) => c.id === userCatId);
      const isRight = userCatId === item.categoryId;

      if (isRight) correct++;

      return {
        question: `Pengelompokan untuk: "${item.text}"`,
        userAnswerText: userCat?.name || 'Belum diisi',
        correctAnswerText: correctCat?.name || '',
        isCorrect: isRight,
        explanation: `"${item.text}" termasuk ke dalam kelompok ${correctCat?.name}.`,
      };
    });

    const score = Math.round((correct / items.length) * 100);
    onFinish(score, correct, items.length, reviewItems);
  };

  const progressPercent = Math.round((Object.keys(placedItems).length / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <MascotAvatar size="sm" emotion={isCompleted ? 'cheering' : 'happy'} />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Kelompokkan ke Keranjang
              </span>
              <h3 className="text-xs text-slate-500 font-bold">{topic.title}</h3>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Dikelompokkan: <strong className="text-amber-600 font-black">{Object.keys(placedItems).length}</strong> / {items.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 font-medium flex items-center justify-between">
        <span>🧺 <strong>Cara Main:</strong> Klik salah satu kartu kata di bawah, lalu klik keranjang tujuan yang cocok!</span>
      </div>

      {/* Unplaced Items Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-slate-200 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Kartu Benda yang Harus Dikelompokkan:</span>
          {unplacedItems.length === 0 && (
            <span className="text-emerald-600 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Semua kartu sudah masuk keranjang!
            </span>
          )}
        </h4>

        {unplacedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`px-4 py-3 rounded-2xl font-black text-sm border-2 transition-all active:scale-95 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-amber-500 border-amber-600 text-white ring-4 ring-amber-200 scale-105'
                      : 'bg-slate-50 hover:bg-amber-50/70 border-slate-300 text-slate-800'
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Klik tombol Periksa Jawaban di bawah untuk melihat skor!</p>
        )}
      </div>

      {/* Category Baskets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {categories.map((cat) => {
          const itemsInCat = items.filter((i) => placedItems[i.id] === cat.id);
          const isTargetReady = selectedItemId !== null;

          return (
            <div
              key={cat.id}
              onClick={() => handlePlaceIntoCategory(cat.id)}
              className={`rounded-3xl p-4 border-3 transition-all flex flex-col justify-between min-h-[220px] ${
                isTargetReady
                  ? 'border-amber-400 bg-amber-50/40 hover:bg-amber-100/50 cursor-pointer shadow-md'
                  : 'border-slate-200 bg-slate-50/80'
              }`}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-200">
                  <h4 className="font-black text-slate-800 text-sm sm:text-base">{cat.name}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {itemsInCat.length}
                  </span>
                </div>

                {/* Items in Basket */}
                <div className="mt-3 space-y-2">
                  {itemsInCat.map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between shadow-xs group"
                    >
                      <span>{item.text}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-500 font-bold text-xs px-1.5 py-0.5 rounded hover:bg-rose-50"
                        title="Keluarkan dari keranjang"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {itemsInCat.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      {isTargetReady ? '👉 Klik di sini untuk memasukkan kartu!' : 'Keranjang masih kosong'}
                    </div>
                  )}
                </div>
              </div>

              {isTargetReady && (
                <div className="mt-2 text-center text-[11px] font-black text-amber-700 bg-amber-100 py-1 rounded-xl">
                  + Masukkan ke sini
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {isCompleted && (
        <button
          onClick={handleFinalSubmit}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-fade-in"
        >
          <span>Periksa & Kumpulkan Jawaban!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
