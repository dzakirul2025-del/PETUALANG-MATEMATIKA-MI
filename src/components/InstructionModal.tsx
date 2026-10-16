import React from 'react';
import { X, CheckCircle, HelpCircle, Layers, Image, Shuffle, ArrowDownUp, Compass, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionModal: React.FC<InstructionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const instructions = [
    {
      title: '1. Kuis Cepat (Pilihan Ganda)',
      icon: <HelpCircle className="w-6 h-6 text-sky-500" />,
      color: 'bg-sky-50 border-sky-200',
      desc: 'Pilih satu dari 4 pilihan jawaban yang paling tepat. Gunakan tombol Bantuan jika ragu dan baca penjelasannya!',
    },
    {
      title: '2. Benar atau Salah',
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-200',
      desc: 'Baca pernyataannya, lalu tentukan apakah fakta tersebut BENAR (centang hijau) atau SALAH (silang merah)!',
    },
    {
      title: '3. Cocokkan Pasangan',
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      desc: 'Klik kartu di sebelah kiri, kemudian klik pasangannya yang cocok di sebelah kanan sampai semua terhubung.',
    },
    {
      title: '4. Drag & Drop (Kelompokkan)',
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50 border-amber-200',
      desc: 'Pilih kartu bilangan/unsur lalu klik keranjang kategori yang sesuai (misal: Pecahan Biasa, Desimal, atau Sifat Kubus/Balok).',
    },
    {
      title: '5. Tebak Gambar',
      icon: <Image className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-50 border-rose-200',
      desc: 'Amati ilustrasi matematika (jaring-jaring balok, pecahan arsir, lingkaran, dadu) lalu tentukan jawaban tepat.',
    },
    {
      title: '6. Susun Kata',
      icon: <Shuffle className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-200',
      desc: 'Rangkai huruf-huruf teracak menjadi istilah matematika (seperti DESIMAL, RATUSAN, VOLUME, PELUANG).',
    },
    {
      title: '7. Susun Urutan (Siklus)',
      icon: <ArrowDownUp className="w-6 h-6 text-teal-500" />,
      color: 'bg-teal-50 border-teal-200',
      desc: 'Gunakan tombol panah untuk menaikkan atau menurunkan langkah hingga urutannya tepat dari awal ke akhir.',
    },
    {
      title: '8. Petualangan Edukasi',
      icon: <Compass className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      desc: 'Jelajahi pulau pengetahuan step by step! Buka level baru, raih bintang 3, dan kalahkan tantangan bos.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">Petunjuk & Cara Bermain</h2>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">Buku Panduan Siswa Madrasah Ibtidaiyah (MI)</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-amber-950 font-bold transition-transform active:scale-95 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
          {/* Scoring rule callout */}
          <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-start gap-3">
            <Award className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900">
              <span className="font-bold">Sistem Penilaian Adil:</span> Nilai akhir kuis dihitung berdasarkan rumus resmi:{' '}
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded font-bold text-blue-800">
                (Jawaban Benar ÷ Total Soal) × 100
              </span>
              . Raih skor 80-100 untuk mengoleksi 3 Bintang Emas dan lencana penghargaan!
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {instructions.map((item, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border-2 ${item.color} flex flex-col gap-1.5`}>
                <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-md transition-all"
          >
            Aku Mengerti, Ayo Main! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
