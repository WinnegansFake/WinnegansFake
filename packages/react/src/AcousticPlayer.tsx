'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  Square,
  Sliders,
  Sparkles,
  Music,
  Radio,
  RotateCcw,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { PageLine } from '@winnegans/core';

export interface AcousticPlayerProps {
  pageNumber: number;
  workId: string;
  lines: PageLine[];
  onActiveLineChange?: (lineNum: number | null) => void;
}

// Web Audio API helper for instant acoustic chimes and fallback tones
function playWebAudioTone(
  type: 'start' | 'test' | 'line',
  customFreq?: number,
  volume: number = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      resolve();
      return;
    }

    try {
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const masterVol = Math.max(0.01, Math.min(1.0, volume)) * 0.25;

      osc.type = 'sine';

      if (type === 'test') {
        // Melodic 3-note arpeggio (C5: 523.25Hz -> E5: 659.25Hz -> G5: 783.99Hz)
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(masterVol, now + 0.04);
        gain.gain.setValueAtTime(masterVol, now + 0.32);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);

        setTimeout(() => {
          ctx.close().catch(() => {});
          resolve();
        }, 600);
      } else if (type === 'start') {
        // Soft welcoming start chime (A4: 440Hz -> E5: 659.25Hz)
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(masterVol * 0.8, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);

        setTimeout(() => {
          ctx.close().catch(() => {});
          resolve();
        }, 400);
      } else {
        // Line acoustic resonance tone
        const freq = customFreq || 440;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(masterVol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);

        setTimeout(() => {
          ctx.close().catch(() => {});
          resolve();
        }, 500);
      }
    } catch (err) {
      console.warn('[AcousticPlayer] Web Audio playback warning:', err);
      resolve();
    }
  });
}

export function AcousticPlayer({
  pageNumber,
  workId,
  lines,
  onActiveLineChange,
}: AcousticPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0.9);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mode, setMode] = useState<'speech' | 'acoustic'>('speech');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(-1);
  const [historicAudioPlaying, setHistoricAudioPlaying] = useState<boolean>(false);
  const [testTonePlaying, setTestTonePlaying] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const historicAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);
  const acousticTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const modeRef = useRef<'speech' | 'acoustic'>('speech');
  const rateRef = useRef<number>(rate);
  const volumeRef = useRef<number>(volume);
  const isMutedRef = useRef<boolean>(isMuted);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
    modeRef.current = mode;
    rateRef.current = rate;
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
  }, [isPlaying, isPaused, mode, rate, volume, isMuted]);

  const isAlpPage = workId === 'finneganswake' && pageNumber >= 213 && pageNumber <= 216;

  // Format friendly work title
  const getWorkTitle = (id: string): string => {
    const clean = id.toLowerCase().replace(/[-_]/g, '');
    if (clean.includes('finnegan')) return 'Finnegans Wake';
    if (clean.includes('ulysses')) return 'Ulysses';
    if (clean.includes('neuromancer') || clean === 'nm') return 'Neuromancer';
    return id;
  };

  // Safe voice loader
  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
      const avail = window.speechSynthesis.getVoices();
      if (avail && avail.length > 0) {
        setVoices(avail);
        setSelectedVoiceURI((prev) => {
          if (prev && avail.some((v) => v.voiceURI === prev)) return prev;
          // Prefer Irish, then British English, then any English, then default
          const preferred =
            avail.find((v) => v.lang.toLowerCase().includes('ie') || v.name.toLowerCase().includes('irish')) ||
            avail.find((v) => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk')) ||
            avail.find((v) => v.lang.startsWith('en')) ||
            avail[0];
          return preferred ? preferred.voiceURI : '';
        });
      }
      return avail || [];
    } catch (err) {
      console.warn('[AcousticPlayer] Voice discovery error:', err);
      return [];
    }
  }, []);

  // Initialize voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setMode('acoustic');
      setNoticeMessage('Web Speech is not supported in this browser environment. Acoustic Tone Synthesizer activated.');
      return;
    }

    const avail = loadVoices();
    if (avail.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
      if (acousticTimerRef.current) clearTimeout(acousticTimerRef.current);
    };
  }, [loadVoices]);

  // Stop speech if page changes
  useEffect(() => {
    handleStop();
    if (historicAudioRef.current) {
      historicAudioRef.current.pause();
      historicAudioRef.current.currentTime = 0;
      setHistoricAudioPlaying(false);
    }
    setNoticeMessage(null);
  }, [pageNumber, workId]);

  // Global watchdog to unstick Chromium SpeechSynthesis
  useEffect(() => {
    if (isPlaying && !isPaused && mode === 'speech') {
      watchdogTimerRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 3500);
    } else {
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
    }
    return () => {
      if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
    };
  }, [isPlaying, isPaused, mode]);

  // Web Audio Acoustic fallback reading loop
  const playAcousticLine = useCallback(
    (idx: number, lineList: PageLine[]) => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      if (idx >= lineList.length) {
        handleStop();
        return;
      }

      setCurrentLineIdx(idx);
      const line = lineList[idx];
      const lineNum =
        typeof line.line === 'number'
          ? line.line
          : (line as { line_number?: number }).line_number || idx + 1;
      if (onActiveLineChange) onActiveLineChange(lineNum);

      const pentatonicScales = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      const toneFreq = pentatonicScales[idx % pentatonicScales.length];
      const currentVol = isMutedRef.current ? 0 : volumeRef.current;

      playWebAudioTone('line', toneFreq, currentVol);

      const textLen = (line.text || '').length;
      const baseDelay = Math.max(900, Math.min(3000, textLen * 45));
      const tempoDelay = baseDelay / (rateRef.current || 1.0);

      acousticTimerRef.current = setTimeout(() => {
        playAcousticLine(idx + 1, lineList);
      }, tempoDelay);
    },
    [onActiveLineChange]
  );

  // Line-by-line speech synthesis
  const speakNextLine = useCallback(
    (idx: number, lineList: PageLine[]) => {
      if (typeof window === 'undefined') return;

      if (modeRef.current === 'acoustic') {
        playAcousticLine(idx, lineList);
        return;
      }

      if (!('speechSynthesis' in window)) {
        setMode('acoustic');
        setNoticeMessage('Speech synthesis not available. Switched to acoustic tone reading.');
        playAcousticLine(idx, lineList);
        return;
      }

      if (idx >= lineList.length) {
        handleStop();
        return;
      }

      const line = lineList[idx];
      const cleanText = line.text?.trim() || '';

      if (!cleanText) {
        if (idx + 1 < lineList.length) {
          speakNextLine(idx + 1, lineList);
        } else {
          handleStop();
        }
        return;
      }

      setCurrentLineIdx(idx);
      const lineNum =
        typeof line.line === 'number'
          ? line.line
          : (line as { line_number?: number }).line_number || idx + 1;
      if (onActiveLineChange) onActiveLineChange(lineNum);

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rateRef.current;
        utterance.volume = isMutedRef.current ? 0 : volumeRef.current;
        utterance.pitch = 1.0;

        activeUtteranceRef.current = utterance;
        (window as unknown as { __winnegansSpeechUtterance: SpeechSynthesisUtterance }).__winnegansSpeechUtterance = utterance;

        const currentVoices = window.speechSynthesis.getVoices();
        const voice = currentVoices.find((v) => v.voiceURI === selectedVoiceURI) ||
          currentVoices.find((v) => v.lang.startsWith('en')) ||
          currentVoices[0];
        if (voice) utterance.voice = voice;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          setNoticeMessage(null);
        };

        utterance.onend = () => {
          activeUtteranceRef.current = null;
          speakNextLine(idx + 1, lineList);
        };

        utterance.onerror = (e) => {
          console.warn('[AcousticPlayer] Speech utterance error:', e.error);
          activeUtteranceRef.current = null;
          if (e.error === 'interrupted' || e.error === 'canceled') {
            return;
          }
          setMode('acoustic');
          setNoticeMessage('Browser speech engine unavailable on this device. Switched to Acoustic Tone Synthesizer.');
          playAcousticLine(idx, lineList);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('[AcousticPlayer] Speech synthesis call error:', err);
        setMode('acoustic');
        setNoticeMessage('Speech synthesis call failed. Switched to Acoustic Tone Synthesizer.');
        playAcousticLine(idx, lineList);
      }
    },
    [selectedVoiceURI, onActiveLineChange, playAcousticLine]
  );

  const handlePlay = () => {
    if (testTonePlaying) setTestTonePlaying(false);

    playWebAudioTone('start', undefined, isMuted ? 0 : volume);

    if (isPaused) {
      if (mode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      } else if (mode === 'acoustic') {
        const nextIdx = currentLineIdx >= 0 ? currentLineIdx : 0;
        playAcousticLine(nextIdx, effectiveLines);
      }
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }

    setIsPlaying(true);
    setIsPaused(false);

    const targetLines = effectiveLines;
    speakNextLine(0, targetLines);
  };

  const handlePause = () => {
    if (isPlaying) {
      if (mode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      if (acousticTimerRef.current) {
        clearTimeout(acousticTimerRef.current);
      }
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (acousticTimerRef.current) {
      clearTimeout(acousticTimerRef.current);
    }
    if (watchdogTimerRef.current) {
      clearInterval(watchdogTimerRef.current);
    }
    activeUtteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLineIdx(-1);
    if (onActiveLineChange) onActiveLineChange(null);
  };

  const handleTestAudio = async () => {
    setTestTonePlaying(true);
    await playWebAudioTone('test', undefined, isMuted ? 0.3 : volume);
    setTestTonePlaying(false);
  };

  // Keyboard shortcut: Press 'R' to toggle play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (isPlayingRef.current && !isPausedRef.current) {
          handlePause();
        } else {
          handlePlay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleHistoricAudio = () => {
    if (!historicAudioRef.current) return;
    if (historicAudioPlaying) {
      historicAudioRef.current.pause();
      setHistoricAudioPlaying(false);
    } else {
      handleStop();
      historicAudioRef.current
        .play()
        .then(() => {
          setHistoricAudioPlaying(true);
          setNoticeMessage(null);
        })
        .catch((err) => {
          console.warn('[AcousticPlayer] Historic audio playback error:', err);
          setHistoricAudioPlaying(false);
          setNoticeMessage('Historic recording stream failed. Check internet connection.');
        });
    }
  };

  const effectiveLines: PageLine[] =
    lines && lines.length > 0
      ? lines
      : [
          {
            line: 1,
            text: `Page ${pageNumber} of ${getWorkTitle(workId)}. No local book text is currently loaded. To read full book lines aloud, load your local EPUB in browser memory, or view pages with scholarly annotations.`,
          },
        ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 shadow-sm text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Left: Status & Controls */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
              isPlaying && !isPaused
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400'
                : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-400'
            }`}
          >
            {isPlaying && !isPaused ? (
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            ) : isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </div>
          <div>
            <div className="font-medium text-slate-200 flex items-center space-x-1.5">
              <span>Listen Aloud</span>
              {isPlaying && !isPaused && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {isPlaying
                ? isPaused
                  ? 'Paused (Press R to resume)'
                  : mode === 'acoustic'
                  ? `Acoustic Tone: Line ${currentLineIdx + 1} of ${effectiveLines.length}`
                  : `Speaking line ${currentLineIdx + 1} of ${effectiveLines.length}`
                : `Acoustic Audio Synthesizer • ${lines.length} lines`}
            </div>
          </div>
        </div>

        {/* Center: Play/Pause/Stop Buttons */}
        <div className="flex items-center space-x-1">
          {!isPlaying || isPaused ? (
            <button
              onClick={handlePlay}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
              title="Read this page aloud (Shortcut: Press R)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen Now'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
              title="Pause audio playback (Shortcut: Press R)"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Stop audio playback"
            >
              <Square className="w-3 h-3 fill-current text-rose-400" />
            </button>
          )}

          {/* Test Audio Button */}
          <button
            onClick={handleTestAudio}
            className={`inline-flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              testTonePlaying
                ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Play test chime to verify your speaker volume"
          >
            <Volume1 className={`w-3 h-3 ${testTonePlaying ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
            <span>{testTonePlaying ? 'Testing...' : 'Test Audio'}</span>
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? 'bg-indigo-950 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Acoustic Voice, Mode & Volume Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Historic Joyce Audio Badge for ALP pages */}
        {isAlpPage && (
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
            <audio
              ref={historicAudioRef}
              preload="none"
              onEnded={() => setHistoricAudioPlaying(false)}
              onError={() => {
                setHistoricAudioPlaying(false);
                setNoticeMessage('Historic recording stream failed. Check internet connection.');
              }}
            >
              <source
                src="https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0e/James_Joyce_reads_from_Anna_Livia_Plurabelle.oga/James_Joyce_reads_from_Anna_Livia_Plurabelle.oga.mp3"
                type="audio/mpeg"
              />
              <source
                src="https://upload.wikimedia.org/wikipedia/commons/0/0e/James_Joyce_reads_from_Anna_Livia_Plurabelle.oga"
                type="audio/ogg"
              />
            </audio>
            <button
              onClick={toggleHistoricAudio}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                historicAudioPlaying
                  ? 'bg-amber-950 text-amber-300 border-amber-500/60 animate-pulse shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30'
              }`}
              title="Listen to James Joyce reading Anna Livia Plurabelle (1929 Cambridge Recording)"
            >
              <Radio className="w-3 h-3 text-amber-400" />
              <span>{historicAudioPlaying ? 'Joyce Speaking (1929)...' : 'Hear Joyce (1929)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Notice / Diagnostic Alert Message */}
      {noticeMessage && (
        <div className="mt-2 p-2 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-[11px] text-indigo-200 flex items-start justify-between gap-2">
          <div className="flex items-start space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>{noticeMessage}</span>
          </div>
          <button
            onClick={() => setNoticeMessage(null)}
            className="text-[10px] text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Voice, Tempo & Volume Settings Drawer */}
      {showSettings && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          {/* Mode & Voice */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Synthesizer Engine:</label>
            <div className="flex rounded-md bg-slate-950 p-0.5 border border-slate-800 mb-2">
              <button
                type="button"
                onClick={() => setMode('speech')}
                className={`flex-1 py-1 px-2 rounded text-[10px] font-medium transition-colors ${
                  mode === 'speech'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Web Speech Voice
              </button>
              <button
                type="button"
                onClick={() => setMode('acoustic')}
                className={`flex-1 py-1 px-2 rounded text-[10px] font-medium transition-colors ${
                  mode === 'acoustic'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Acoustic Tones
              </button>
            </div>

            {mode === 'speech' && (
              <>
                <label className="block text-slate-400 font-medium mb-1">Voice / Dialect:</label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {voices.length === 0 ? (
                    <option value="">Default Browser Voice</option>
                  ) : (
                    voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </>
            )}
          </div>

          {/* Tempo / Rate */}
          <div>
            <div className="flex items-center justify-between text-slate-400 font-medium mb-1">
              <span>Speech Tempo:</span>
              <span className="font-mono text-indigo-400">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
              <span>0.6x (Deliberate)</span>
              <span>1.0x</span>
              <span>1.4x (Brisk)</span>
            </div>
          </div>

          {/* Volume & Audio Diagnostics */}
          <div>
            <div className="flex items-center justify-between text-slate-400 font-medium mb-1">
              <span>Volume:</span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                </button>
                <span className="font-mono text-indigo-400">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
              <span>Keyboard: Press &apos;R&apos; to toggle</span>
              <button
                type="button"
                onClick={handleTestAudio}
                className="text-indigo-400 hover:underline flex items-center space-x-0.5"
              >
                <span>Check Speakers &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
