/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, MaterialTopic, Badge } from './types/game';
import { INITIAL_TOPICS, INITIAL_BADGES } from './data/kurikulumData';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { InstructionModal } from './components/InstructionModal';
import { BadgeGallery } from './components/BadgeGallery';
import { CustomMaterialModal } from './components/CustomMaterialModal';
import { ResultScreen, AnswerReviewItem } from './components/ResultScreen';
import { DeveloperModal } from './components/DeveloperModal';
import { MusicPlayerWidget } from './components/MusicPlayerWidget';
import { bgMusicManager } from './utils/music';

// Game Mode Components
import { QuizGame } from './components/games/QuizGame';
import { TrueFalseGame } from './components/games/TrueFalseGame';
import { MatchPairsGame } from './components/games/MatchPairsGame';
import { DragDropGame } from './components/games/DragDropGame';
import { GuessPictureGame } from './components/games/GuessPictureGame';
import { WordScrambleGame } from './components/games/WordScrambleGame';
import { SequenceGame } from './components/games/SequenceGame';
import { AdventureGame } from './components/games/AdventureGame';

export default function App() {
  // Topics state (specifically Matematika Kelas 6 MI - 50 Soal Pecahan & Desimal)
  const [topics, setTopics] = useState<MaterialTopic[]>(() => {
    try {
      const saved = localStorage.getItem('petualangan_mi_kelas6_pecahan50_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.quizQuestions?.length === 50) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_TOPICS;
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    return 'bab-2-pecahan-desimal';
  });

  // Badges & Stars state
  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('petualangan_badges');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_BADGES;
  });

  const [totalStars, setTotalStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('petualangan_stars');
      if (saved) {
        return parseInt(saved, 10) || 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  // UI Flow State
  const [currentScreen, setCurrentScreen] = useState<'home' | 'playing' | 'result'>('home');
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('quiz');

  // Modals
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isTeacherModeOpen, setIsTeacherModeOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Audio toggles
  const [soundEnabled, setSoundEnabled] = useState(soundManager.getSoundEnabled());
  const [voiceEnabled, setVoiceEnabled] = useState(soundManager.getVoiceEnabled());
  const [musicPlaying, setMusicPlaying] = useState(bgMusicManager.getIsEnabled());

  // Bersama Bintang (Drive) background music: auto-start every time the web is opened
  useEffect(() => {
    // Attempt playback immediately upon web mount
    if (bgMusicManager.getIsEnabled()) {
      bgMusicManager.start();
      setMusicPlaying(true);
    }

    // Subscribe to music state changes
    const unsub = bgMusicManager.subscribe(() => {
      setMusicPlaying(bgMusicManager.getIsPlaying());
    });

    // Browsers require at least 1 user gesture to unlock audio context/YouTube playback if initially blocked
    const handleFirstGesture = () => {
      if (bgMusicManager.getIsEnabled() && !bgMusicManager.getIsPlaying()) {
        bgMusicManager.start();
        setMusicPlaying(true);
      }
    };

    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });

    return () => {
      unsub();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleToggleMusic = () => {
    const isNowPlaying = bgMusicManager.togglePlay();
    setMusicPlaying(isNowPlaying);
  };

  // Result state
  const [resultScore, setResultScore] = useState(0);
  const [resultCorrectCount, setResultCorrectCount] = useState(0);
  const [resultTotalCount, setResultTotalCount] = useState(0);
  const [resultStars, setResultStars] = useState(1);
  const [resultReviews, setResultReviews] = useState<AnswerReviewItem[]>([]);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<string | undefined>(undefined);

  // Find currently active topic
  const activeTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('petualangan_mi_kelas6_pecahan50_topics', JSON.stringify(topics));
    } catch {
      // ignore
    }
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem('petualangan_badges', JSON.stringify(badges));
      localStorage.setItem('petualangan_stars', totalStars.toString());
    } catch {
      // ignore
    }
  }, [badges, totalStars]);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setSoundEnabled(nextVal);
  };

  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    soundManager.setVoiceEnabled(nextVal);
  };

  const handleAddTopic = (newTopic: MaterialTopic) => {
    setTopics((prev) => [newTopic, ...prev]);
    setSelectedTopicId(newTopic.id);
  };

  const handleStartGame = (mode: GameMode) => {
    setActiveGameMode(mode);
    setCurrentScreen('playing');
    setNewlyUnlockedBadge(undefined);
  };

  // Check and unlock achievement badges
  const checkBadgeUnlocks = (score: number, mode: GameMode, topic: MaterialTopic) => {
    let unlockedName: string | undefined = undefined;

    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;

        // Badge: First Step
        if (badge.id === 'badge-first-step') {
          shouldUnlock = true;
        }
        // Badge: Perfect 100
        else if (badge.id === 'badge-perfect-100' && score === 100) {
          shouldUnlock = true;
        }
        // Badge: Science Master
        else if (badge.id === 'badge-science-master' && topic.subject === 'ipas' && score >= 80) {
          shouldUnlock = true;
        }
        // Badge: Math Genius
        else if (badge.id === 'badge-math-genius' && topic.subject === 'matematika' && score >= 80) {
          shouldUnlock = true;
        }
        // Badge: Garuda Patriot
        else if (badge.id === 'badge-garuda-patriot' && topic.subject === 'pancasila' && score >= 80) {
          shouldUnlock = true;
        }
        // Badge: Speedy Sorter
        else if (badge.id === 'badge-speedy-sorter' && mode === 'drag_drop' && score === 100) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          unlockedName = badge.title;
          soundManager.playStar();
          return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return badge;
      })
    );

    return unlockedName;
  };

  const handleGameFinished = (
    score: number,
    correctCount: number,
    totalCount: number,
    reviews: AnswerReviewItem[]
  ) => {
    const earnedStars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
    setResultScore(score);
    setResultCorrectCount(correctCount);
    setResultTotalCount(totalCount);
    setResultStars(earnedStars);
    setResultReviews(reviews);

    // Add stars
    setTotalStars((prev) => prev + earnedStars);

    // Check badges
    const badgeName = checkBadgeUnlocks(score, activeGameMode, activeTopic);
    if (badgeName) {
      setNewlyUnlockedBadge(badgeName);
    }

    setCurrentScreen('result');
  };

  const handleFinishAdventure = (totalScore: number, stagesCompleted: number) => {
    handleGameFinished(totalScore, stagesCompleted, 5, [
      {
        question: 'Misi Petualangan Ekspedisi Pulau Pengetahuan',
        userAnswerText: `${stagesCompleted} Pos Dituntaskan`,
        correctAnswerText: '5 Pos Sempurna',
        isCorrect: stagesCompleted >= 4,
        explanation: 'Kamu telah menuntaskan pos-pos ekspedisi dengan gemilang dan berani!',
      },
    ]);
  };

  const handleRestartCurrentGame = () => {
    setCurrentScreen('playing');
  };

  const handleGoHome = () => {
    soundManager.stopSpeaking();
    setCurrentScreen('home');
  };

  const getModeTitle = (mode: GameMode): string => {
    switch (mode) {
      case 'quiz':
        return 'Kuis Cepat Pilihan Ganda';
      case 'true_false':
        return 'Benar atau Salah';
      case 'match_pairs':
        return 'Cocokkan Pasangan';
      case 'drag_drop':
        return 'Drag & Drop Pengelompokan';
      case 'guess_picture':
        return 'Tebak Gambar';
      case 'word_scramble':
        return 'Susun Kata';
      case 'sequence':
        return 'Susun Urutan Tahapan';
      case 'adventure':
        return 'Petualangan Edukasi';
      default:
        return 'Permainan Edukasi';
    }
  };

  const unlockedBadgeCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-amber-50/40 to-slate-50 text-slate-800 font-sans selection:bg-amber-200">
      {/* App Header */}
      <Header
        currentScreen={currentScreen}
        onGoHome={handleGoHome}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenCustomMateri={() => setIsTeacherModeOpen(true)}
        onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
        soundEnabled={soundEnabled}
        voiceEnabled={voiceEnabled}
        musicPlaying={musicPlaying}
        onToggleSound={handleToggleSound}
        onToggleVoice={handleToggleVoice}
        onToggleMusic={handleToggleMusic}
        unlockedBadgeCount={unlockedBadgeCount}
      />

      {/* Main Content Area */}
      <main className="pb-8 pt-2 flex-1">
        {currentScreen === 'home' && (
          <HomeHero
            topics={topics}
            selectedTopic={activeTopic}
            onSelectTopic={(id) => setSelectedTopicId(id)}
            onStartGame={handleStartGame}
            onOpenInstructions={() => setIsInstructionsOpen(true)}
            onOpenTeacherMode={() => setIsTeacherModeOpen(true)}
            onOpenDeveloperInfo={() => setIsDeveloperModalOpen(true)}
            totalStars={totalStars}
            unlockedBadgeCount={unlockedBadgeCount}
          />
        )}

        {currentScreen === 'playing' && (
          <div className="pt-2">
            {activeGameMode === 'quiz' && (
              <QuizGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'true_false' && (
              <TrueFalseGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'match_pairs' && (
              <MatchPairsGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'drag_drop' && (
              <DragDropGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'guess_picture' && (
              <GuessPictureGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'word_scramble' && (
              <WordScrambleGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'sequence' && (
              <SequenceGame topic={activeTopic} onFinish={handleGameFinished} onExit={handleGoHome} />
            )}
            {activeGameMode === 'adventure' && (
              <AdventureGame
                topic={activeTopic}
                onFinishAdventure={handleFinishAdventure}
                onExit={handleGoHome}
              />
            )}
          </div>
        )}

        {currentScreen === 'result' && (
          <ResultScreen
            score={resultScore}
            correctCount={resultCorrectCount}
            totalCount={resultTotalCount}
            stars={resultStars}
            topicTitle={activeTopic.title}
            modeTitle={getModeTitle(activeGameMode)}
            reviewItems={resultReviews}
            onRestart={handleRestartCurrentGame}
            onGoHome={handleGoHome}
            newBadgeUnlocked={newlyUnlockedBadge}
          />
        )}
      </main>

      {/* Educational Footer */}
      <footer className="border-t-2 border-emerald-200 bg-white/80 py-5 text-center text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-black text-emerald-800 text-sm">
            Petualangan Matematika Ceria MI • Kelas 6 / Fase C
          </p>
          <p className="font-semibold text-slate-500">
            Kurikulum Merdeka (Semester Ganjil & Genap) — Dirancang Khusus untuk Siswa Madrasah Ibtidaiyah
          </p>
          <p className="pt-1 text-slate-700">
            Pengembang Aplikasi: <span className="font-black text-emerald-700">Dzakirul Husni, S.Pd.</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <InstructionModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      <BadgeGallery
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        badges={badges}
        totalStars={totalStars}
      />

      <CustomMaterialModal
        isOpen={isTeacherModeOpen}
        onClose={() => setIsTeacherModeOpen(false)}
        onAddTopic={handleAddTopic}
        existingTopics={topics}
        selectedTopicId={selectedTopicId}
        onSelectTopic={(id) => setSelectedTopicId(id)}
      />

      <DeveloperModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />

      {/* Floating Gentle Instrumental Music Widget */}
      <MusicPlayerWidget
        musicPlaying={musicPlaying}
        onToggleMusic={handleToggleMusic}
      />
    </div>
  );
}
