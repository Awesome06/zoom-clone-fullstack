"use client";

import { useState, useEffect } from 'react';

export function useLocalMediaStream(isVideoOn: boolean, isMuted: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const getMedia = async () => {
      try {
        if (isVideoOn || !isMuted) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: isVideoOn,
            audio: !isMuted,
          });
          activeStream = mediaStream;
          setStream(mediaStream);
        } else {
          setStream(null);
        }
      } catch (err) {
        console.error("Failed to get local media:", err);
        setStream(null);
      }
    };

    getMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn, isMuted]);

  return stream;
}
