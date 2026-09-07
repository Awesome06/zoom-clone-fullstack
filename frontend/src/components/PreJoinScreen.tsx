"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Meeting } from "@/lib/types";
import VideoPlayer from "./VideoPlayer";

interface PreJoinScreenProps {
  meeting: Meeting | null;
  defaultName: string;
  onJoin: (name: string, isMuted: boolean, isVideoOn: boolean) => void;
}

export default function PreJoinScreen({ meeting, defaultName, onJoin }: PreJoinScreenProps) {
  const [name, setName] = useState(defaultName);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
        })
        .catch((err) => {
          console.error("Failed to get local video:", err);
          setIsVideoOn(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn]);

  const handleJoinClick = () => {
    if (name.trim()) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      onJoin(name.trim(), isMuted, isVideoOn);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Join Meeting</h1>
        {meeting && <p className="text-gray-400">{meeting.title}</p>}
      </div>

      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8 items-center md:items-start p-4">
        {/* Video Preview */}
        <div className="flex-1 w-full relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl border border-gray-700 flex items-center justify-center">
          {isVideoOn ? (
             <VideoPlayer 
              stream={stream}
              autoPlay 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-medium">
              {name.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {/* Media Toggles overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
             <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-800/80 text-white hover:bg-gray-700'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full flex items-center justify-center transition-all ${
                !isVideoOn ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-800/80 text-white hover:bg-gray-700'
              }`}
            >
              {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Form Controls */}
        <div className="w-full md:w-80 flex flex-col gap-6 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zoom-blue focus:ring-1 focus:ring-zoom-blue transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            onClick={handleJoinClick}
            disabled={!name.trim()}
            className="w-full bg-[#0B5CFF] hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zoom-blue/20"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
