/**
 * Background Music Manager with Multi-Track Playlist Support
 * Supports:
 * 1. "Bersama Bintang" by DRIVE (https://youtu.be/R_DpYHPoQEU)
 * 2. "Summertime Sadness" by Lana Del Rey (https://youtu.be/EDcPdwHB7RE)
 * 3. Custom user-added YouTube links
 * 4. Offline/Acoustic Synthesizer fallback
 */

export type MusicMode = 'youtube' | 'synth';
export type LoopMode = 'playlist' | 'single';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  youtubeUrl: string;
  description: string;
  category: string;
  coverEmoji: string;
  isCustom?: boolean;
}

export const DEFAULT_TRACKS: MusicTrack[] = [
  {
    id: 'bersama-bintang',
    title: 'Bersama Bintang',
    artist: 'DRIVE',
    youtubeId: 'R_DpYHPoQEU',
    youtubeUrl: 'https://youtu.be/R_DpYHPoQEU?si=srUeC4uE3kE2d0Tn',
    description: 'Lagu pop syahdu & menenangkan untuk fokus belajar',
    category: 'Pop Syahdu',
    coverEmoji: '⭐',
  },
  {
    id: 'summertime-sadness',
    title: 'Summertime Sadness',
    artist: 'Lana Del Rey',
    youtubeId: 'EDcPdwHB7RE',
    youtubeUrl: 'https://youtu.be/EDcPdwHB7RE?si=hkQxJLqSAu8L0rFD',
    description: 'Audio mellow, rileks, dan menemani suasana belajar',
    category: 'Mellow Chill',
    coverEmoji: '🌸',
  },
];

type Listener = () => void;

class BackgroundMusicManager {
  private mode: MusicMode = 'youtube';
  private loopMode: LoopMode = 'playlist';
  private isPlaying: boolean = false;
  private isEnabled: boolean = true;
  private volume: number = 0.28;
  private listeners: Set<Listener> = new Set();

  private playlist: MusicTrack[] = [...DEFAULT_TRACKS];
  private currentTrackIndex: number = 0;

  // YouTube player instance reference
  private ytPlayer: any = null;
  private isYtReady: boolean = false;

  // Web Audio Synthesizer specifics
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private synthTimerId: number | null = null;
  private currentStep: number = 0;

  // Chords for Track 1: Bersama Bintang (C - G - Am - Em - F - C - Dm - G)
  private readonly bersamaBintangChords = [
    { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25], melody: [329.63, 392.00, 440.00, 392.00] },
    { bass: 98.00,  notes: [246.94, 293.66, 392.00, 493.88], melody: [293.66, 329.63, 392.00, 329.63] },
    { bass: 110.00, notes: [261.63, 329.63, 440.00, 523.25], melody: [261.63, 329.63, 349.23, 329.63] },
    { bass: 82.41,  notes: [246.94, 329.63, 392.00, 493.88], melody: [246.94, 293.66, 329.63, 246.94] },
    { bass: 87.31,  notes: [220.00, 261.63, 349.23, 440.00], melody: [220.00, 261.63, 329.63, 293.66] },
    { bass: 130.81, notes: [196.00, 261.63, 329.63, 392.00], melody: [196.00, 261.63, 329.63, 392.00] },
    { bass: 146.83, notes: [220.00, 261.63, 293.66, 349.23], melody: [349.23, 329.63, 293.66, 261.63] },
    { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00], melody: [293.66, 246.94, 261.63, 293.66] },
  ];

  // Chords for Track 2: Summertime Sadness (Am - F - C - G)
  private readonly summertimeChords = [
    { bass: 110.00, notes: [220.00, 261.63, 329.63, 440.00], melody: [523.25, 493.88, 440.00, 392.00] },
    { bass: 87.31,  notes: [174.61, 220.00, 261.63, 349.23], melody: [440.00, 392.00, 349.23, 329.63] },
    { bass: 130.81, notes: [196.00, 261.63, 329.63, 392.00], melody: [329.63, 349.23, 392.00, 329.63] },
    { bass: 98.00,  notes: [196.00, 246.94, 293.66, 392.00], melody: [392.00, 329.63, 293.66, 261.63] },
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedPref = localStorage.getItem('petualangan_music_enabled');
      if (savedPref !== null) {
        this.isEnabled = savedPref === 'true';
      }

      const savedVol = localStorage.getItem('petualangan_music_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const savedMode = localStorage.getItem('petualangan_music_mode');
      if (savedMode === 'youtube' || savedMode === 'synth') {
        this.mode = savedMode;
      }

      const savedLoop = localStorage.getItem('petualangan_music_loop');
      if (savedLoop === 'playlist' || savedLoop === 'single') {
        this.loopMode = savedLoop;
      }

      const savedCustom = localStorage.getItem('petualangan_music_custom_tracks');
      if (savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.playlist = [...DEFAULT_TRACKS, ...parsed];
          }
        } catch {
          // ignore corrupted data
        }
      }

      const savedIndex = localStorage.getItem('petualangan_music_current_index');
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < this.playlist.length) {
          this.currentTrackIndex = idx;
        }
      }

      this.setupAutoPlayOnOpen();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // ignore listener errors
      }
    });
  }

  private setupAutoPlayOnOpen() {
    const tryStart = () => {
      if (this.isEnabled && !this.isPlaying) {
        this.start();
      }
      window.removeEventListener('click', tryStart);
      window.removeEventListener('touchstart', tryStart);
      window.removeEventListener('keydown', tryStart);
    };

    window.addEventListener('click', tryStart, { passive: true });
    window.addEventListener('touchstart', tryStart, { passive: true });
    window.addEventListener('keydown', tryStart, { passive: true });

    if (document.readyState === 'complete') {
      tryStart();
    } else {
      window.addEventListener('load', () => tryStart(), { once: true });
    }
  }

  // --- Playlist Management ---
  public getPlaylist(): MusicTrack[] {
    return this.playlist;
  }

  public getCurrentTrack(): MusicTrack {
    return this.playlist[this.currentTrackIndex] || this.playlist[0] || DEFAULT_TRACKS[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public selectTrack(index: number) {
    if (index < 0 || index >= this.playlist.length) return;
    this.currentTrackIndex = index;
    localStorage.setItem('petualangan_music_current_index', String(index));

    const track = this.getCurrentTrack();

    if (this.mode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        if (this.isEnabled && this.isPlaying) {
          this.ytPlayer.loadVideoById(track.youtubeId);
        } else {
          this.ytPlayer.cueVideoById(track.youtubeId);
        }
      } catch {
        // fallback
      }
    } else if (this.mode === 'synth') {
      this.currentStep = 0;
    }

    this.notify();
  }

  public nextTrack() {
    const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.selectTrack(nextIndex);
  }

  public prevTrack() {
    const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.selectTrack(prevIndex);
  }

  public addCustomTrack(url: string, title?: string, artist?: string): boolean {
    const videoId = this.extractYouTubeId(url);
    if (!videoId) return false;

    const newTrack: MusicTrack = {
      id: `custom-${Date.now()}`,
      title: title?.trim() || `Lagu Pilihan (${videoId})`,
      artist: artist?.trim() || 'YouTube Audio',
      youtubeId: videoId,
      youtubeUrl: url.trim(),
      description: 'Lagu pilihan tambahan dari link YouTube',
      category: 'Pilihan Pengguna',
      coverEmoji: '🎵',
      isCustom: true,
    };

    this.playlist.push(newTrack);
    const customOnly = this.playlist.filter((t) => t.isCustom);
    localStorage.setItem('petualangan_music_custom_tracks', JSON.stringify(customOnly));

    // Automatically switch to the newly added track
    this.selectTrack(this.playlist.length - 1);
    return true;
  }

  public removeCustomTrack(trackId: string) {
    const trackToRemove = this.playlist.find((t) => t.id === trackId);
    if (!trackToRemove || !trackToRemove.isCustom) return;

    this.playlist = this.playlist.filter((t) => t.id !== trackId);
    if (this.currentTrackIndex >= this.playlist.length) {
      this.currentTrackIndex = Math.max(0, this.playlist.length - 1);
    }

    const customOnly = this.playlist.filter((t) => t.isCustom);
    localStorage.setItem('petualangan_music_custom_tracks', JSON.stringify(customOnly));
    this.selectTrack(this.currentTrackIndex);
  }

  public extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const trimmed = url.trim();
    // Matches: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, etc.
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    // Direct 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    return null;
  }

  public getLoopMode(): LoopMode {
    return this.loopMode;
  }

  public toggleLoopMode() {
    this.loopMode = this.loopMode === 'playlist' ? 'single' : 'playlist';
    localStorage.setItem('petualangan_music_loop', this.loopMode);
    this.notify();
  }

  // --- YouTube Player integration ---
  public bindYouTubePlayer(player: any) {
    this.ytPlayer = player;
    this.isYtReady = true;

    try {
      this.ytPlayer.setVolume(Math.round(this.volume * 100));
      const track = this.getCurrentTrack();
      if (this.isEnabled && this.mode === 'youtube') {
        this.ytPlayer.loadVideoById(track.youtubeId);
      } else {
        this.ytPlayer.cueVideoById(track.youtubeId);
      }
    } catch {
      // player might still be buffering
    }
  }

  public handleYouTubeStateChange(state: number) {
    // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
    if (state === 1) {
      this.isPlaying = true;
      this.notify();
    } else if (state === 2) {
      if (this.mode === 'youtube') {
        this.isPlaying = false;
        this.notify();
      }
    } else if (state === 0) {
      // Song ended
      if (this.loopMode === 'playlist') {
        this.nextTrack();
      } else {
        // Repeat current track
        try {
          this.ytPlayer.playVideo();
        } catch {
          // ignore
        }
      }
    }
  }

  public handleYouTubeError() {
    console.warn('YouTube playback error, switching seamlessly to acoustic synth');
    this.setMode('synth');
    if (this.isEnabled) {
      this.start();
    }
  }

  // --- Synthesizer Implementation ---
  private initSynthAudio() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && !this.masterGain) {
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(1500, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.1, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isEnabled ? this.volume : 0, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private playTone(frequency: number, startTime: number, duration: number, isBass: boolean = false, isMelody: boolean = false) {
    if (!this.ctx || !this.filterNode) return;

    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = isBass ? 'sine' : isMelody ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(frequency, startTime);

      if (isMelody) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(3.8, startTime);
        lfoGain.gain.setValueAtTime(1.8, startTime);
        lfo.connect(osc.frequency);
        lfo.start(startTime);
        lfo.stop(startTime + duration);
      }

      const attackTime = isBass ? 0.08 : 0.03;
      const peakVol = isBass ? 0.32 : isMelody ? 0.22 : 0.14;

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(peakVol, startTime + attackTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.filterNode);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch {
      // Audio fallback
    }
  }

  private scheduleSynthTick = () => {
    if (!this.isPlaying || this.mode !== 'synth' || !this.ctx) return;

    const track = this.getCurrentTrack();
    const chords = track.id === 'summertime-sadness' ? this.summertimeChords : this.bersamaBintangChords;

    const chordIndex = Math.floor(this.currentStep / 4) % chords.length;
    const stepInChord = this.currentStep % 4;
    const currentChord = chords[chordIndex];
    const now = this.ctx.currentTime;
    const stepDuration = 0.90;

    if (stepInChord === 0) {
      this.playTone(currentChord.bass, now, stepDuration * 3.8, true, false);
    }

    const arpeggioNote = currentChord.notes[stepInChord % currentChord.notes.length];
    this.playTone(arpeggioNote, now + 0.02, stepDuration * 1.6, false, false);

    const melodyFreq = currentChord.melody[stepInChord];
    if (melodyFreq) {
      this.playTone(melodyFreq, now + stepDuration * 0.1, stepDuration * 1.4, false, true);
    }

    this.currentStep = (this.currentStep + 1) % (chords.length * 4);
    this.synthTimerId = window.setTimeout(this.scheduleSynthTick, stepDuration * 1000);
  };

  private startSynth() {
    this.initSynthAudio();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => this.runSynthPlayback()).catch(() => {});
    } else {
      this.runSynthPlayback();
    }
  }

  private runSynthPlayback() {
    if (this.synthTimerId !== null) return;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.5);
    }
    this.scheduleSynthTick();
  }

  private pauseSynth() {
    if (this.synthTimerId !== null) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    }
  }

  // --- Public Controls ---
  public start() {
    this.isEnabled = true;
    localStorage.setItem('petualangan_music_enabled', 'true');

    if (this.mode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        const track = this.getCurrentTrack();
        this.ytPlayer.loadVideoById(track.youtubeId);
        this.isPlaying = true;
      } catch {
        this.startSynth();
        this.isPlaying = true;
      }
    } else if (this.mode === 'synth') {
      this.startSynth();
      this.isPlaying = true;
    } else {
      this.isPlaying = true;
      this.startSynth();
    }
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // ignore
      }
    }
    this.pauseSynth();
    this.notify();
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      this.setEnabled(false);
    } else {
      this.setEnabled(true);
      this.start();
    }
    return this.isPlaying;
  }

  public setMode(newMode: MusicMode) {
    if (this.mode === newMode) return;
    const wasPlaying = this.isPlaying;

    if (this.mode === 'youtube') {
      try {
        if (this.ytPlayer && this.isYtReady) {
          this.ytPlayer.pauseVideo();
        }
      } catch {
        // ignore
      }
    } else {
      this.pauseSynth();
    }

    this.mode = newMode;
    localStorage.setItem('petualangan_music_mode', newMode);

    if (wasPlaying && this.isEnabled) {
      if (newMode === 'youtube') {
        try {
          if (this.ytPlayer && this.isYtReady) {
            const track = this.getCurrentTrack();
            this.ytPlayer.loadVideoById(track.youtubeId);
            this.isPlaying = true;
          } else {
            this.startSynth();
          }
        } catch {
          this.startSynth();
        }
      } else {
        this.startSynth();
        this.isPlaying = true;
      }
    }
    this.notify();
  }

  public getMode(): MusicMode {
    return this.mode;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('petualangan_music_enabled', String(enabled));
    if (enabled) {
      this.start();
    } else {
      this.pause();
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    localStorage.setItem('petualangan_music_volume', clamped.toFixed(2));

    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.setVolume(Math.round(clamped * 100));
      } catch {
        // ignore
      }
    }

    if (this.masterGain && this.ctx && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.1);
    }

    this.notify();
  }
}

export const bgMusicManager = new BackgroundMusicManager();
