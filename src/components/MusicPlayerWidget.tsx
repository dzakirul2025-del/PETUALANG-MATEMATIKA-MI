import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Radio, 
  Tv, 
  Star, 
  ListMusic, 
  Plus, 
  Trash2,
  Check
} from 'lucide-react';
import { bgMusicManager, MusicMode, MusicTrack } from '../utils/music';
import { soundManager } from '../utils/audio';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface MusicPlayerWidgetProps {
  musicPlaying: boolean;
  onToggleMusic: () => void;
}

export const MusicPlayerWidget: React.FC<MusicPlayerWidgetProps> = ({ musicPlaying, onToggleMusic }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(bgMusicManager.getVolume());
  const [mode, setMode] = useState<MusicMode>(bgMusicManager.getMode());
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(bgMusicManager.getCurrentTrack());
  const [playlist, setPlaylist] = useState<MusicTrack[]>(bgMusicManager.getPlaylist());
  const [loopMode, setLoopMode] = useState(bgMusicManager.getLoopMode());
  const [showAutoStartedToast, setShowAutoStartedToast] = useState(true);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom track form
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const ytPlayerRef = useRef<any>(null);

  // Sync state with bgMusicManager
  const syncState = () => {
    setVolume(bgMusicManager.getVolume());
    setMode(bgMusicManager.getMode());
    setCurrentTrack(bgMusicManager.getCurrentTrack());
    setPlaylist([...bgMusicManager.getPlaylist()]);
    setLoopMode(bgMusicManager.getLoopMode());
  };

  useEffect(() => {
    const unsubscribe = bgMusicManager.subscribe(() => {
      syncState();
    });
    return unsubscribe;
  }, []);

  // Initialize YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const setupPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (ytPlayerRef.current) return;

      const playerElement = document.getElementById('petualangan-yt-iframe');
      if (!playerElement) return;

      try {
        const activeTrack = bgMusicManager.getCurrentTrack();
        const player = new window.YT.Player('petualangan-yt-iframe', {
          height: '100%',
          width: '100%',
          videoId: activeTrack.youtubeId,
          playerVars: {
            autoplay: bgMusicManager.getIsEnabled() ? 1 : 0,
            controls: 1,
            loop: 1,
            playlist: activeTrack.youtubeId,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              ytPlayerRef.current = event.target;
              bgMusicManager.bindYouTubePlayer(event.target);
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              bgMusicManager.handleYouTubeStateChange(event.data);
            },
            onError: () => {
              if (!isMounted) return;
              bgMusicManager.handleYouTubeError();
            },
          },
        });
      } catch (err) {
        console.warn('YouTube Player initialization failed, using synth mode:', err);
        bgMusicManager.handleYouTubeError();
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const scriptTag = document.createElement('script');
        scriptTag.id = 'youtube-iframe-api';
        scriptTag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(scriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) setupPlayer();
      };

      const interval = setInterval(() => {
        if (window.YT && window.YT.Player && !ytPlayerRef.current) {
          clearInterval(interval);
          if (isMounted) setupPlayer();
        }
      }, 300);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-hide toast after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAutoStartedToast(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    bgMusicManager.setVolume(newVol);
  };

  const handleModeChange = (newMode: MusicMode) => {
    soundManager.playClick();
    setMode(newMode);
    bgMusicManager.setMode(newMode);
  };

  const handleSelectTrack = (index: number) => {
    soundManager.playClick();
    bgMusicManager.selectTrack(index);
    if (!musicPlaying) {
      bgMusicManager.start();
    }
  };

  const handleNextTrack = () => {
    soundManager.playClick();
    bgMusicManager.nextTrack();
  };

  const handlePrevTrack = () => {
    soundManager.playClick();
    bgMusicManager.prevTrack();
  };

  const handleToggleLoop = () => {
    soundManager.playClick();
    bgMusicManager.toggleLoopMode();
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!newUrl.trim()) {
      setAddError('Masukkan URL YouTube yang valid');
      return;
    }

    const success = bgMusicManager.addCustomTrack(newUrl, newTitle, newArtist);
    if (success) {
      soundManager.playCorrect();
      setAddSuccess(true);
      setNewUrl('');
      setNewTitle('');
      setNewArtist('');
      setTimeout(() => {
        setAddSuccess(false);
        setShowAddForm(false);
      }, 1500);
    } else {
      soundManager.playWrong();
      setAddError('Link YouTube tidak valid. Contoh: https://youtu.be/...');
    }
  };

  const handleDeleteTrack = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    soundManager.playClick();
    bgMusicManager.removeCustomTrack(trackId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 animate-fade-in select-none">
      {/* Hidden/Active YouTube container in the DOM */}
      <div 
        className={`transition-all duration-300 overflow-hidden rounded-2xl border-2 border-amber-300 shadow-2xl bg-black ${
          isExpanded && showVideoPreview 
            ? 'w-80 h-48 mb-1 block' 
            : 'w-1 h-1 opacity-0 pointer-events-none absolute -bottom-96'
        }`}
      >
        <div id="petualangan-yt-iframe" className="w-full h-full" />
      </div>

      {/* Auto-start welcoming notice */}
      {showAutoStartedToast && musicPlaying && (
        <div className="bg-slate-900/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-amber-400/50 text-xs flex items-center gap-2.5 animate-bounce-subtle max-w-xs">
          <span className="text-base flex-shrink-0">{currentTrack.coverEmoji}</span>
          <div className="leading-tight">
            <span className="font-bold text-amber-200">
              {currentTrack.title} ({currentTrack.artist})
            </span>
            <p className="text-[10px] text-slate-300">Musik syahdu aktif menemani belajar matematika!</p>
          </div>
          <button
            onClick={() => setShowAutoStartedToast(false)}
            className="text-slate-400 hover:text-white font-bold ml-1 text-sm p-1"
            title="Tutup Notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Expanded Control Box */}
      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border-2 border-amber-300 w-84 sm:w-88 text-slate-800 space-y-3 transition-all animate-fade-in max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2 border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎧</span>
              <div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  Daftar Musik Pengiring
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-md font-extrabold">
                    {playlist.length} Lagu
                  </span>
                </h4>
                <p className="text-[11px] font-semibold text-slate-500">Menenangkan & Menambah Fokus Belajar</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Currently Playing Card */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-9 h-9 rounded-xl bg-white shadow-xs border border-amber-200 flex items-center justify-center text-lg flex-shrink-0">
                  {currentTrack.coverEmoji}
                </span>
                <div className="truncate">
                  <h5 className="text-xs font-black text-slate-900 truncate">
                    {currentTrack.title}
                  </h5>
                  <p className="text-[10px] text-amber-800 font-bold truncate">
                    {currentTrack.artist} • <span className="text-slate-500 font-medium">{currentTrack.category}</span>
                  </p>
                </div>
              </div>

              {/* Animated visualizer */}
              {musicPlaying && (
                <div className="flex items-end gap-1 h-5 px-1 flex-shrink-0">
                  <span className="w-1 bg-amber-500 rounded-full animate-[bounce_0.8s_infinite] h-4" />
                  <span className="w-1 bg-orange-500 rounded-full animate-[bounce_0.6s_infinite_0.2s] h-5" />
                  <span className="w-1 bg-yellow-400 rounded-full animate-[bounce_0.7s_infinite_0.4s] h-3" />
                  <span className="w-1 bg-amber-600 rounded-full animate-[bounce_0.5s_infinite_0.1s] h-4" />
                </div>
              )}
            </div>

            {/* Playback Controls (Prev, Play/Pause, Next, Loop) */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={handlePrevTrack}
                title="Lagu Sebelumnya"
                className="p-2 rounded-xl bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleMusic();
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer ${
                  musicPlaying ? 'bg-gradient-to-tr from-amber-500 to-orange-500' : 'bg-slate-500 hover:bg-slate-600'
                }`}
                title={musicPlaying ? 'Jeda Musik' : 'Putar Musik'}
              >
                {musicPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNextTrack}
                title="Lagu Berikutnya"
                className="p-2 rounded-xl bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleLoop}
                title={loopMode === 'playlist' ? 'Mode: Putar Berurutan Semua Lagu' : 'Mode: Ulangi Lagu Ini Terus'}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  loopMode === 'playlist'
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-orange-100 border-orange-400 text-orange-900'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="text-[10px]">{loopMode === 'playlist' ? 'Daftar' : 'Ulang 1'}</span>
              </button>
            </div>
          </div>

          {/* Playlist list */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ListMusic className="w-3.5 h-3.5 text-amber-600" /> Pilih Lagu Pengiring
              </label>
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddForm ? 'Tutup Input' : 'Tambah Lagu (+)'}</span>
              </button>
            </div>

            {/* Custom Track Input Form */}
            {showAddForm && (
              <form onSubmit={handleAddTrack} className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200 space-y-2 text-xs animate-fade-in">
                <p className="text-[11px] font-extrabold text-amber-900">Tambah Lagu dari YouTube:</p>
                <input
                  type="text"
                  placeholder="Paste link YouTube (misal: https://youtu.be/...)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-amber-500"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="Judul Lagu (Opsional)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Penyanyi (Opsional)"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px]"
                  />
                </div>
                {addError && <p className="text-[10px] font-bold text-red-600">{addError}</p>}
                {addSuccess && (
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Lagu berhasil ditambahkan!
                  </p>
                )}
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 font-bold text-[11px] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                  >
                    Simpan Lagu
                  </button>
                </div>
              </form>
            )}

            {/* List of Tracks */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {playlist.map((track, idx) => {
                const isActive = track.id === currentTrack.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(idx)}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      isActive
                        ? 'bg-amber-100/80 border-amber-400 shadow-xs ring-1 ring-amber-300'
                        : 'bg-slate-50 hover:bg-amber-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-base flex-shrink-0">{track.coverEmoji}</span>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`text-xs font-black truncate ${isActive ? 'text-amber-950 font-extrabold' : 'text-slate-800'}`}>
                            {track.title}
                          </span>
                          {isActive && (
                            <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-black">
                              Diputar
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isActive && musicPlaying ? (
                        <Pause className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-400 hover:text-amber-700" />
                      )}

                      {track.isCustom && (
                        <button
                          onClick={(e) => handleDeleteTrack(e, track.id)}
                          title="Hapus Lagu Ini"
                          className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio Source Mode (YouTube vs Synth) */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Sumber Pemutaran
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => handleModeChange('youtube')}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'youtube'
                    ? 'bg-white text-amber-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Audio</span>
              </button>
              <button
                onClick={() => handleModeChange('synth')}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'synth'
                    ? 'bg-white text-emerald-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Music className="w-3.5 h-3.5 text-emerald-600" />
                <span>Akustik Synth</span>
              </button>
            </div>
          </div>

          {/* Video Preview Toggle & Current Track YouTube Link */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <button
              onClick={() => setShowVideoPreview((prev) => !prev)}
              className="text-[11px] font-bold text-slate-600 hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-amber-600" />
              <span>{showVideoPreview ? 'Sembunyikan Klip' : 'Lihat Klip Video'}</span>
            </button>

            <a
              href={currentTrack.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
              title={`Buka ${currentTrack.title} di YouTube`}
            >
              <span>Buka YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Volume Control */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" /> Volume Musik:
              </span>
              <span className="text-amber-800 font-black">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            {/* Quick volume presets */}
            <div className="flex items-center justify-between gap-1 text-[10px] font-extrabold text-slate-500 pt-0.5">
              <button
                onClick={() => handleVolumeChange(0.15)}
                className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                  Math.abs(volume - 0.15) < 0.04 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                Halus (15%)
              </button>
              <button
                onClick={() => handleVolumeChange(0.28)}
                className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                  Math.abs(volume - 0.28) < 0.04 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                Nyaman (28%)
              </button>
              <button
                onClick={() => handleVolumeChange(0.50)}
                className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                  Math.abs(volume - 0.50) < 0.04 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 border-slate-200'
                }`}
              >
                Jelas (50%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg border-2 border-amber-400">
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleMusic();
          }}
          title={musicPlaying ? `Jeda Musik: ${currentTrack.title}` : `Putar Musik: ${currentTrack.title}`}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-black transition-all cursor-pointer ${
            musicPlaying
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className={`text-xs ${musicPlaying ? 'animate-bounce' : ''}`}>{currentTrack.coverEmoji}</span>
          <span className="hidden sm:inline max-w-[130px] truncate">
            {musicPlaying ? currentTrack.title : 'Putar Musik'}
          </span>
          {musicPlaying ? <Pause className="w-3 h-3 fill-current ml-0.5" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsExpanded((prev) => !prev);
          }}
          title="Buka Daftar Lagu & Pengaturan Musik"
          className="p-1.5 rounded-full text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
