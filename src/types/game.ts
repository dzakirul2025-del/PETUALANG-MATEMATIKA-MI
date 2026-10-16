export type GameMode = 
  | 'quiz'           // Kuis Cepat (Pilihan Ganda)
  | 'true_false'     // Benar atau Salah
  | 'match_pairs'    // Cocokkan Pasangan
  | 'drag_drop'      // Drag and Drop (Kelompokkan)
  | 'guess_picture'  // Tebak Gambar
  | 'word_scramble'  // Susun Kata
  | 'sequence'       // Susun Urutan
  | 'adventure';     // Petualangan Edukasi

export type SubjectCategory = 'ipas' | 'matematika' | 'bahasa' | 'pancasila';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  hint?: string;
  illustrationType?: 'plant' | 'photosynthesis' | 'solid_liquid_gas' | 'food_chain' | 'fractions' | 'shapes' | 'pancasila_garuda' | 'indonesia_culture';
}

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface MatchPairItem {
  id: string;
  left: string;
  right: string;
  matchKey: string;
}

export interface DragDropCategory {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export interface DragDropItem {
  id: string;
  text: string;
  categoryId: string;
  explanation?: string;
}

export interface GuessPictureQuestion {
  id: string;
  title: string;
  question: string;
  svgType: 'leaf' | 'root' | 'stem' | 'flower' | 'evaporation' | 'melting' | 'square' | 'triangle' | 'circle' | 'cube' | 'circle_parts' | 'barchart' | 'numberline' | 'place_value' | 'fractions' | 'ratio_scale' | 'cube_net' | 'dice_probability' | 'pancasila_star' | 'chain' | 'banyan_tree' | 'bull_head' | 'rice_cotton';
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WordScrambleQuestion {
  id: string;
  word: string;
  hint: string;
  description: string;
  category: string;
}

export interface SequenceStep {
  id: string;
  text: string;
  order: number;
}

export interface SequenceQuestion {
  id: string;
  title: string;
  instruction: string;
  steps: SequenceStep[];
  explanation: string;
}

export interface AdventureStage {
  id: number;
  title: string;
  description: string;
  type: GameMode;
  targetScore: number;
  island: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
}

export interface MaterialTopic {
  id: string;
  title: string;
  subject: SubjectCategory;
  grade: string; // e.g., "Kelas 6 MI"
  semester?: string; // "Semester Ganjil" | "Semester Genap" | "Semester Ganjil & Genap"
  curriculum: string; // "Kurikulum Merdeka (Fase C)"
  chapter: string;
  learningObjectives: string[];
  summary: string;
  quizQuestions: QuizQuestion[];
  trueFalseQuestions: TrueFalseQuestion[];
  matchPairs: MatchPairItem[];
  dragDrop: {
    categories: DragDropCategory[];
    items: DragDropItem[];
  };
  guessPictures: GuessPictureQuestion[];
  wordScrambles: WordScrambleQuestion[];
  sequences: SequenceQuestion[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameHistoryItem {
  id: string;
  date: string;
  topicTitle: string;
  mode: GameMode;
  score: number;
  correctCount: number;
  totalCount: number;
  stars: number;
}
