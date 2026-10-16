import React from 'react';
import { X, Award, BookOpen, Calendar, School, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-emerald-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between border-b-4 border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Profil Pengembang & Kurikulum</h2>
              <p className="text-xs text-emerald-100 font-medium">Madrasah Ibtidaiyah (MI) Unggul</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center text-white font-bold transition-transform active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Developer Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              DH
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Pengembang Aplikasi
              </span>
              <h3 className="text-lg font-black text-slate-800 mt-0.5">Dzakirul Husni, S.Pd.</h3>
              <p className="text-xs text-slate-600 font-medium">Guru & Desainer Media Pembelajaran Interaktif</p>
            </div>
          </div>

          {/* Identity Table */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <School className="w-4 h-4 text-emerald-600" /> Jenjang Sekolah:
              </span>
              <span className="font-black text-slate-800">Madrasah Ibtidaiyah (MI)</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Mata Pelajaran:
              </span>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Matematika
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Kelas & Fase:
              </span>
              <span className="font-black text-slate-800">Kelas 6 / Fase C</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Semester:
              </span>
              <span className="font-black text-slate-800">Semester Ganjil dan Genap</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kurikulum:
              </span>
              <span className="font-black text-slate-800">Kurikulum Merdeka</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
            🌟 <strong>Dedikasi Pembelajaran:</strong> Aplikasi ini dirancang khusus untuk memfasilitasi pemahaman konsep Matematika kelas 6 MI secara interaktif, menyenangkan, dan berorientasi pada pencapaian Profil Pelajar Pancasila dan Rahmatan Lil &apos;Alamin.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
