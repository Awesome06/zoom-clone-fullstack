"use client";

import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream | null;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const VideoPlayer = React.memo(({ stream, className, autoPlay = true, muted = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      className={className || "w-full h-full object-cover"}
    />
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
