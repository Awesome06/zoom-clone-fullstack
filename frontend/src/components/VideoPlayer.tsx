"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const VideoPlayer = React.memo(({ stream, className, autoPlay = true, muted = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBrowserSurface, setIsBrowserSurface] = useState(false);

  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.displaySurface === 'browser') {
          setIsBrowserSurface(true);
        } else {
          setIsBrowserSurface(false);
        }
      }
    } else {
      setIsBrowserSurface(false);
    }

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      {!isBrowserSurface && (
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          muted={muted}
          playsInline
          className={`w-full h-full object-cover`}
        />
      )}
      {isBrowserSurface && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Infinity Mirror Warning</h3>
          <p className="text-sm bg-black/50 px-4 py-2 rounded-lg">
            You are sharing the browser tab that contains this meeting room.
            <br />This can cause an infinite visual feedback loop.
          </p>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
