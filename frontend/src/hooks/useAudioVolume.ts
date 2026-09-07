"use client";

import { useEffect, useState, useRef } from 'react';

export function useAudioVolume(stream: MediaStream | null, threshold: number = 15, delayMs: number = 1000) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!stream) {
      setIsSpeaking(false);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setIsSpeaking(false);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    let isUnmounted = false;
    let animationFrameId: number;

    const checkVolume = () => {
      if (isUnmounted) return;

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      if (average > threshold) {
        setIsSpeaking(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (!isUnmounted) setIsSpeaking(false);
        }, delayMs);
      }

      animationFrameId = requestAnimationFrame(checkVolume);
    };

    checkVolume();

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(animationFrameId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      source.disconnect();
      audioContext.close().catch(() => {});
    };
  }, [stream, threshold, delayMs]);

  return isSpeaking;
}

export function useAudioLevel(stream: MediaStream | null) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setLevel(0);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let isUnmounted = false;
    let animationFrameId: number;

    const updateLevel = () => {
      if (isUnmounted) return;

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Normalize to 0-100 (max average is usually around 100-150 depending on loudness)
      const normalizedLevel = Math.min(100, Math.max(0, (average / 100) * 100));
      setLevel(normalizedLevel);

      animationFrameId = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(animationFrameId);
      source.disconnect();
      audioContext.close().catch(() => {});
    };
  }, [stream]);

  return level;
}
