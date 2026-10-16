import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Check, FileText } from 'lucide-react';
import { MaterialTopic, SubjectCategory } from '../types/game';
import { soundManager } from '../utils/audio';

interface CustomMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (newTopic: MaterialTopic) => void;
  existingTopics: MaterialTopic[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
}

export const CustomMaterialModal: React.FC<CustomMaterialModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
  existingTopics,
  selectedTopicId,
  onSelectTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'create'>('preset');

  // Form states for creating custom topic
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('matematika');
  const [grade, setGrade] = useState('Kelas 6 MI');
  const [chapter, setChapter] = useState('');
  const [objectives, setObjectives] = useState('');
  const [summary, setSummary] = useState('');
  const [sampleQuestionText, setSampleQuestionText] = useState('');
  const [sampleAnswerText, setSampleAnswerText] = useState('');

  if (!isOpen) return null;

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim()) {
      alert('Mohon isi Judul Topik dan Bab Materi!');
      return;
    }

    soundManager.playCorrect();

    const newTopic: MaterialTopic = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subject,
      grade,
      curriculum: 'Kurikulum Merdeka (Fase B/C)',
      chapter: chapter.trim(),
      learningObjectives: objectives.split('\n').filter((o) => o.trim().length > 0),
      summary: summary.trim() || 'Rangkuman materi pembelajaran interaktif Kurikulum Merdeka.',
      quizQuestions: [
        {
          id: `cq1-${Date.now()}`,
          question: sampleQuestionText.trim() || `Apa konsep utama dari materi ${title}?`,
          options: [
            sampleAnswerText.trim() || 'Pernyataan benar sesuai materi',
            'Pernyataan yang kurang tepat',
            'Pernyataan yang keliru',
            'Bukan bagian dari materi',
          ],
          correctAnswer: 0,
          explanation: `Jawaban tepat adalah opsi pertama sesuai pembahasan materi ${chapter}.`,
          hint: 'Perhatikan kata kunci pada rangkuman materi.',
        },
        {
          id: `cq2-${Date.now()}`,
          question: `Mengapa kita perlu mempelajari ${title} dalam kehidupan sehari-hari?`,
          options: [
            'Untuk memahami lingkungan dan mengamalkan ilmu dengan bijak',
            'Hanya untuk mendapatkan nilai ulangan saja',
            'Karena disuruh tanpa tujuan yang jelas',
            'Agar bisa pamer kepada orang lain',
          ],
          correctAnswer: 0,
          explanation: 'Tujuan utama belajar adalah memahami konsep dan menerapkannya untuk kebaikan bersama.',
        },
      ],
      trueFalseQuestions: [
        {
          id: `ctf1-${Date.now()}`,
          statement: `Materi ${title} memberikan manfaat positif bagi perkembangan ilmu pengetahuan.`,
          isTrue: true,
          explanation: 'Benar! Setiap ilmu yang dipelajari membantu siswa mengembangkan nalar kritis dan pemahaman.',
        },
      ],
      matchPairs: [
        { id: 'cmp1', left: 'Konsep Pokok', right: title, matchKey: 'pair-c1' },
        { id: 'cmp2', left: 'Tujuan Pembelajaran', right: 'Menguasai kompetensi dasar materi', matchKey: 'pair-c2' },
      ],
      dragDrop: {
        categories: [
          { id: 'ccat1', name: 'Kategori A 🟢', color: 'emerald', iconName: 'CheckCircle' },
          { id: 'ccat2', name: 'Kategori B 🔵', color: 'blue', iconName: 'Star' },
        ],
        items: [
          { id: 'citem1', text: `Unsur Penting ${title}`, categoryId: 'ccat1' },
          { id: 'citem2', text: `Penerapan ${chapter}`, categoryId: 'ccat2' },
        ],
      },
      guessPictures: [
        {
          id: `cgp1-${Date.now()}`,
          title: `Simbol Utama ${title}`,
          question: `Ilustrasi manakah yang paling mewakili konsep ${title}?`,
          svgType: 'leaf',
          options: ['Bagian Daun', 'Akar Tanah', 'Bunga Mekar', 'Batang Pohon'],
          correctAnswer: 0,
          explanation: 'Ilustrasi merepresentasikan bagian terpenting dari materi yang dipelajari.',
        },
      ],
      wordScrambles: [
        {
          id: `cws1-${Date.now()}`,
          word: title.replace(/[^a-zA-Z]/g, '').slice(0, 10).toUpperCase() || 'MERDEKA',
          hint: `Kata kunci utama dari topik ${title}`,
          description: `Istilah penting yang sering muncul pada bab ${chapter}`,
          category: 'Materi Kustom Guru',
        },
      ],
      sequences: [
        {
          id: `cseq1-${Date.now()}`,
          title: `Langkah Belajar ${title}`,
          instruction: 'Urutkan tahapan belajar materi ini agar pemahamanmu sempurna!',
          steps: [
            { id: 'cs1', text: 'Membaca tujuan pembelajaran dan konsep utama', order: 1 },
            { id: 'cs2', text: 'Memahami contoh dan pengamatan langsung', order: 2 },
            { id: 'cs3', text: 'Mengerjakan tantangan dan kuis interaktif', order: 3 },
            { id: 'cs4', text: 'Menyimpulkan hasil belajar bersama guru dan teman', order: 4 },
          ],
          explanation: 'Belajar teratur dari konsep, latihan, hingga refleksi membuat pemahaman lebih mendalam!',
        },
      ],
    };

    onAddTopic(newTopic);
    onSelectTopic(newTopic.id);
    onClose();
  };

  const handleQuickAddBahasa = () => {
    soundManager.playCorrect();
    const bahasaTopic: MaterialTopic = {
      id: 'bahasa-cerita-rakyat',
      title: 'Cerita Rakyat & Kalimat Efektif',
      subject: 'bahasa',
      grade: 'Kelas 4 SD',
      curriculum: 'Kurikulum Merdeka (Fase B)',
      chapter: 'Bab: Menjelajah Cerita Nusantara & Menulis Kalimat Efektif',
      learningObjectives: [
        'Mengidentifikasi tokoh, latar, dan amanat dalam cerita rakyat nusantara.',
        'Membedakan kalimat transitif (membutuhkan objek) dan kalimat intransitif.',
        'Mengenal majas personifikasi dan metafora dalam kalimat sederhana.',
        'Menulis kalimat dengan ejaan dan tanda baca yang benar.'
      ],
      summary: 'Bahasa Indonesia mengajarkan kita kekayaan cerita dongeng nusantara yang sarat pesan moral kebaikan. Kita juga belajar menyusun kalimat efektif berpola Subjek-Predikat-Objek-Keterangan (S-P-O-K) dengan santun dan jelas.',
      quizQuestions: [
        {
          id: 'bq1',
          question: 'Pesan moral atau nasihat kebaikan yang ingin disampaikan pengarang dalam cerita disebut...',
          options: ['Amanat', 'Latar waktu', 'Alur cerita', 'Tokoh pembantu'],
          correctAnswer: 0,
          explanation: 'Amanat adalah pesan moral luhur yang dapat kita teladani dari sebuah cerita.',
          hint: 'Berisi pesan kebaikan untuk pembaca.',
        },
        {
          id: 'bq2',
          question: 'Manakah kalimat berikut yang termasuk kalimat transitif (memerlukan objek)?',
          options: ['Bubu membaca buku cerita di teras', 'Kiko bernyanyi merdu', 'Adik tertidur lelap', 'Kucing itu melompat'],
          correctAnswer: 0,
          explanation: '"Bubu membaca buku cerita" memiliki Objek yaitu "buku cerita". Sedangkan kalimat lain tidak memiliki objek.',
          hint: 'Cari kalimat yang ada kata bendanya setelah kata kerja tindakan.',
        },
        {
          id: 'bq3',
          question: '"Angin malam berbisik lembut di telingaku." Kalimat tersebut menggunakan majas...',
          options: ['Personifikasi', 'Hiperbola', 'Asosiasi', 'Litotes'],
          correctAnswer: 0,
          explanation: 'Majas personifikasi mengumpamakan benda mati (angin) seolah-olah bernyawa dan bisa berbisik seperti manusia.',
          hint: 'Membuat benda mati seolah-olah hidup seperti orang.',
        },
        {
          id: 'bq4',
          question: 'Tokoh dalam cerita yang berwatak baik dan patut dicontoh disebut tokoh...',
          options: ['Protagonis', 'Antagonis', 'Tritagonis', 'Figuran'],
          correctAnswer: 0,
          explanation: 'Protagonis adalah tokoh utama yang memiliki sifat-sifat baik dan terpuji.',
          hint: 'Tokoh baik yang biasanya menjadi pahlawan dalam cerita.',
        },
        {
          id: 'bq5',
          question: 'Penulisan huruf kapital yang benar di bawah ini adalah...',
          options: ['Ibu pergi ke kota Bandung hari selasa.', 'Ibu pergi ke Kota Bandung hari Selasa.', 'Ibu pergi ke kota bandung hari Selasa.', 'ibu pergi ke Kota bandung hari selasa.'],
          correctAnswer: 1,
          explanation: 'Nama kota (Bandung) dan nama hari (Selasa) harus diawali dengan huruf kapital.',
          hint: 'Perhatikan huruf depan nama hari dan nama kota.',
        },
        {
          id: 'bq6',
          question: 'Dongeng nusantara yang menceritakan seorang anak durhaka yang dikutuk menjadi batu di Pantai Air Manis adalah...',
          options: ['Malin Kundang', 'Sangkuriang', 'Bawang Merah Bawang Putih', 'Timun Mas'],
          correctAnswer: 0,
          explanation: 'Cerita rakyat Malin Kundang dari Sumatra Barat mengingatkan kita untuk selalu berbakti dan menyayangi ibu.',
          hint: 'Berasal dari Sumatra Barat.',
        },
        {
          id: 'bq7',
          question: 'Kata baku yang tepat untuk melengkapi kalimat: "Dokter memberikan ... obat kepada pasien" adalah...',
          options: ['Resep', 'Resep dokteran', 'Resep-resepan', 'Racikan obat'],
          correctAnswer: 0,
          explanation: 'Kata baku menurut KBBI adalah "resep".',
          hint: 'Kata baku yang tercantum resmi di Kamus Besar Bahasa Indonesia.',
        },
        {
          id: 'bq8',
          question: 'Tanda baca yang digunakan untuk mengakhiri kalimat tanya adalah...',
          options: ['Tanda tanya (?)', 'Tanda seru (!)', 'Tanda titik (.)', 'Tanda koma (,)'],
          correctAnswer: 0,
          explanation: 'Kalimat tanya selalu diakhiri dengan tanda tanya (?).',
          hint: 'Bentuknya melengkung dengan titik di bawahnya.',
        },
        {
          id: 'bq9',
          question: 'Latar dalam sebuah cerita meliputi...',
          options: ['Tempat, waktu, dan suasana', 'Nama tokoh dan umurnya', 'Harga tiket masuk tempat', 'Judul buku dan penerbit'],
          correctAnswer: 0,
          explanation: 'Latar (setting) menceritakan di mana kejadian berlangsung (tempat), kapan (waktu), dan bagaimana suasananya.',
          hint: 'Menjelaskan tempat, waktu, dan suasana kejadian.',
        },
        {
          id: 'bq10',
          question: 'Lawan kata (antonim) dari kata "Rajin" adalah...',
          options: ['Malas', 'Pintar', 'Cepat', 'Tekun'],
          correctAnswer: 0,
          explanation: 'Antonim dari rajin adalah malas. Sedangkan tekun adalah sinonimnya.',
          hint: 'Sikap tidak mau bergerak atau belajar.',
        },
      ],
      trueFalseQuestions: [
        {
          id: 'btf1',
          statement: 'Amanat adalah pesan moral yang ingin disampaikan pengarang kepada pembaca.',
          isTrue: true,
          explanation: 'Benar! Cerita rakyat selalu membawa amanat luhur seperti kejujuran dan berbakti kepada orang tua.',
        },
        {
          id: 'btf2',
          statement: 'Kalimat yang membutuhkan objek dinamakan kalimat intransitif.',
          isTrue: false,
          explanation: 'Salah! Kalimat yang butuh objek adalah kalimat transitif. Sedangkan intransitif tidak butuh objek.',
        },
        {
          id: 'btf3',
          statement: 'Nama orang, nama kota, dan awal kalimat wajib diawali huruf kapital.',
          isTrue: true,
          explanation: 'Benar! Sesuai kaidah ejaan bahasa Indonesia yang disempurnakan (EYD).',
        },
      ],
      matchPairs: [
        { id: 'bmp1', left: 'Protagonis', right: 'Tokoh berwatak baik', matchKey: 'b-pro' },
        { id: 'bmp2', left: 'Antagonis', right: 'Tokoh berwatak jahat/penentang', matchKey: 'b-anta' },
        { id: 'bmp3', left: 'Amanat', right: 'Pesan moral dalam cerita', matchKey: 'b-amanat' },
        { id: 'bmp4', left: 'Latar', right: 'Tempat, waktu, dan suasana', matchKey: 'b-latar' },
      ],
      dragDrop: {
        categories: [
          { id: 'cat_transitif', name: 'Kalimat Transitif 📘', color: 'blue', iconName: 'Book' },
          { id: 'cat_intransitif', name: 'Kalimat Intransitif 📗', color: 'emerald', iconName: 'Feather' },
        ],
        items: [
          { id: 'bitem1', text: 'Ibu memasak nasi goreng', categoryId: 'cat_transitif' },
          { id: 'bitem2', text: 'Budi bernyanyi merdu', categoryId: 'cat_intransitif' },
          { id: 'bitem3', text: 'Ayah membaca koran pagi', categoryId: 'cat_transitif' },
          { id: 'bitem4', text: 'Adik tertawa terbahak-bahak', categoryId: 'cat_intransitif' },
          { id: 'bitem5', text: 'Kiko menanam pohon mangga', categoryId: 'cat_transitif' },
          { id: 'bitem6', text: 'Burung pipit terbang tinggi', categoryId: 'cat_intransitif' },
        ],
      },
      guessPictures: [
        {
          id: 'bgp1',
          title: 'Tebak Asal Cerita Rakyat',
          question: 'Cerita rakyat Malin Kundang si anak durhaka berasal dari provinsi...',
          svgType: 'leaf',
          options: ['Sumatra Barat', 'Jawa Barat', 'Kalimantan Timur', 'Papua'],
          correctAnswer: 0,
          explanation: 'Malin Kundang berasal dari Minangkabau, Sumatra Barat, terkenal dengan batu Malin di Pantai Air Manis.',
        },
      ],
      wordScrambles: [
        {
          id: 'bws1',
          word: 'PROTAGONIS',
          hint: 'Tokoh utama yang memiliki sifat dan watak baik dalam cerita.',
          description: 'Lawan dari tokoh antagonis yang jahat.',
          category: 'Bahasa Indonesia - Unsur Cerita',
        },
        {
          id: 'bws2',
          word: 'AMANAT',
          hint: 'Pesan kebaikan atau moral yang ada di dalam dongeng.',
          description: 'Nasihat bijak untuk pembaca.',
          category: 'Bahasa Indonesia - Unsur Cerita',
        },
      ],
      sequences: [
        {
          id: 'bseq1',
          title: 'Urutan Alur Cerita Narasi',
          instruction: 'Susun urutan alur cerita narasi yang baik dari awal sampai akhir!',
          steps: [
            { id: 'bs1', text: 'Pengenalan tokoh dan latar tempat cerita', order: 1 },
            { id: 'bs2', text: 'Munculnya masalah atau peristiwa mendebarkan (Konflik)', order: 2 },
            { id: 'bs3', text: 'Puncak masalah (Klimaks cerita)', order: 3 },
            { id: 'bs4', text: 'Penyelesaian masalah dan pesan moral (Resolusi)', order: 4 },
          ],
          explanation: 'Cerita tersusun teratur: Pengenalan -> Muncul masalah -> Puncak masalah -> Penyelesaian!',
        },
      ],
    };

    onAddTopic(bahasaTopic);
    onSelectTopic(bahasaTopic.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-purple-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex items-center justify-between text-white border-b-4 border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
              👨‍🏫
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Mode Guru & Modul Pembelajaran</h2>
              <p className="text-xs sm:text-sm text-purple-200 font-medium">
                Pilih kurikulum atau tambahkan materi ajarmu sendiri
              </p>
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

        {/* Tab switch */}
        <div className="flex border-b border-purple-100 bg-purple-50/50 p-2 gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('preset');
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'preset'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-700 hover:bg-purple-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pilih Materi Kurikulum</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('create');
            }}
            className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'create'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Buat Materi Sendiri</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'preset' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                💡 <span className="font-bold">Kurikulum Merdeka Siap Main:</span> Pilih bab yang ingin dipelajari siswa hari ini. Setiap bab dilengkapi 8 mode game interaktif otomatis!
              </div>

              {/* Topic Cards */}
              <div className="space-y-3">
                {existingTopics.map((topic) => {
                  const isSelected = topic.id === selectedTopicId;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        soundManager.playClick();
                        onSelectTopic(topic.id);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-300'
                          : 'border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              {topic.subject.toUpperCase()} • {topic.grade}
                            </span>
                            {isSelected && (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Sedang Aktif
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-slate-800 text-base mt-1">{topic.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{topic.chapter}</p>
                        </div>
                      </div>

                      {/* Objectives summary */}
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-600 font-bold mb-1">Tujuan Pembelajaran:</p>
                        <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                          {topic.learningObjectives.slice(0, 2).map((obj, i) => (
                            <li key={i} className="line-clamp-1">{obj}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick load Bahasa Indonesia preset if not already present */}
              {!existingTopics.some((t) => t.id === 'bahasa-cerita-rakyat') && (
                <div className="pt-2">
                  <button
                    onClick={handleQuickAddBahasa}
                    className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Muat Materi Bahasa Indonesia (Cerita Rakyat & Kalimat Efektif)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 font-medium">
                Guru atau orang tua dapat memasukkan materi atau bab baru. Sistem akan merangkai game interaktif secara otomatis!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Materi / Topik</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rantai Makanan & Jaring-jaring Makanan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ipas">IPAS (Sains & Sosial)</option>
                    <option value="matematika">Matematika</option>
                    <option value="bahasa">Bahasa Indonesia</option>
                    <option value="pancasila">Pendidikan Pancasila</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang / Kelas</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Kelas 1 SD">Kelas 1 SD (Fase A)</option>
                    <option value="Kelas 2 SD">Kelas 2 SD (Fase A)</option>
                    <option value="Kelas 3 SD">Kelas 3 SD (Fase B)</option>
                    <option value="Kelas 4 SD">Kelas 4 SD (Fase B)</option>
                    <option value="Kelas 5 SD">Kelas 5 SD (Fase C)</option>
                    <option value="Kelas 6 SD">Kelas 6 SD (Fase C)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bab / Sumber Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bab 3 Ekosistem yang Harmonis - Buku Siswa Kemendikbud"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Pembelajaran (1 baris per tujuan)</label>
                <textarea
                  rows={2}
                  placeholder="Menganalisis hubungan antarmakhluk hidup dalam rantai makanan&#10;Mendeskripsikan peran produsen, konsumen, dan pengurai"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rangkuman / Catatan Materi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan intisari materi yang ingin ditekankan untuk dipahami siswa..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all active:scale-95"
              >
                Simpan & Mainkan Modul Ini! 🎮
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
