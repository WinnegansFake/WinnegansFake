'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sliders,
  Sparkles,
  Music,
  Radio,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageLine } from '@/types/annotations';

export interface AcousticPlayerProps {
  pageNumber: number;
  workId: string;
  lines: PageLine[];
  onActiveLineChange?: (lineNum: number | null) => void;
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(-1);
  const [historicAudioPlaying, setHistoricAudioPlaying] = useState<boolean>(false);
  const historicAudioRef = useRef<HTMLAudioElement | null>(null);

  const isAlpPage = workId === 'finneganswake' && pageNumber >= 213 && pageNumber <= 216;

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      setVoices(avail);
      if (avail.length > 0 && !selectedVoiceURI) {
        // Prefer Irish or British English if present
        const preferred =
          avail.find((v) => v.lang.toLowerCase().includes('ie') || v.name.toLowerCase().includes('irish')) ||
          avail.find((v) => v.lang.toLowerCase().includes('gb') || v.lang.toLowerCase().includes('uk')) ||
          avail.find((v) => v.lang.startsWith('en')) ||
          avail[0];
        if (preferred) setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech if page changes
  useEffect(() => {
    handleStop();
    if (historicAudioRef.current) {
      historicAudioRef.current.pause();
      historicAudioRef.current.currentTime = 0;
      setHistoricAudioPlaying(false);
    }
  }, [pageNumber, workId]);

  const speakNextLine = (idx: number) => {
    if (idx >= lines.length || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      handleStop();
      return;
    }

    setCurrentLineIdx(idx);
    const line = lines[idx];
    const lineNum = typeof line.line === 'number' ? line.line : (line as { line_number?: number }).line_number || idx + 1;
    if (onActiveLineChange) onActiveLineChange(lineNum);

    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.rate = rate;

    const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      speakNextLine(idx + 1);
    };

    utterance.onerror = () => {
      handleStop();
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setIsPaused(false);
    speakNextLine(0);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLineIdx(-1);
    if (onActiveLineChange) onActiveLineChange(null);
  };

  const toggleHistoricAudio = () => {
    if (!historicAudioRef.current) return;
    if (historicAudioPlaying) {
      historicAudioRef.current.pause();
      setHistoricAudioPlaying(false);
    } else {
      handleStop(); // stop TTS
      historicAudioRef.current.play().catch(() => {});
      setHistoricAudioPlaying(true);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 shadow-sm text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Left: Status & Controls */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Volume2 className="w-3.5 h-3.5" />
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
                  ? 'Paused'
                  : `Speaking line ${currentLineIdx + 1} of ${lines.length}`
                : 'Acoustic Web Speech Synthesizer'}
            </div>
          </div>
        </div>

        {/* Center: Play/Pause/Stop Buttons */}
        <div className="flex items-center space-x-1">
          {!isPlaying || isPaused ? (
            <button
              onClick={handlePlay}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              title="Read this page aloud (Press R)"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isPaused ? 'Resume' : 'Listen'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all"
              title="Pause playback"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Stop speech"
            >
              <Square className="w-3 h-3 fill-current text-rose-400" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? 'bg-indigo-950 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Acoustic Voice & Dialect Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Historic Joyce Audio Badge for ALP pages */}
        {isAlpPage && (
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
            <audio
              ref={historicAudioRef}
              src="https://upload.wikimedia.org/wikipedia/commons/e/ec/James_Joyce_reading_Finnegans_Wake_%28Anna_Livia_Plurabelle%29.ogg"
              onEnded={() => setHistoricAudioPlaying(false)}
              onError={() => setHistoricAudioPlaying(false)}
            />
            <button
              onClick={toggleHistoricAudio}
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                historicAudioPlaying
                  ? 'bg-amber-950 text-amber-300 border-amber-500/60 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30'
              }`}
              title="Listen to James Joyce reading Anna Livia Plurabelle (1929 Gramophone Recording)"
            >
              <Radio className="w-3 h-3 text-amber-400" />
              <span>{historicAudioPlaying ? 'Joyce Speaking (1929)...' : 'Hear Joyce (1929)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Voice & Speed Settings Drawer */}
      {showSettings && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Voice / Dialect:</label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

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
              <span>0.6x (Slow)</span>
              <span>1.0x</span>
              <span>1.4x (Fast)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
