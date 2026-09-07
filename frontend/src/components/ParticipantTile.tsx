"use client";

import { Participant } from "@/lib/types";
import { MicOff, VideoOff, MoreVertical, Mic, Video, ShieldAlert } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useAudioVolume } from "@/hooks/useAudioVolume";
import { useState, useRef, useEffect } from "react";

interface ParticipantTileProps {
  participant: Participant;
  isHost?: boolean;
  stream?: MediaStream | null;
  isLocalUser?: boolean;
  onToggleMute?: (id: number, currentMuted: boolean) => void;
  onToggleVideo?: (id: number, currentVideoOn: boolean) => void;
  onRemove?: (id: number) => void;
}

export default function ParticipantTile({ 
  participant, 
  isHost, 
  stream,
  isLocalUser,
  onToggleMute,
  onToggleVideo,
  onRemove
}: ParticipantTileProps) {
  const isSpeakingByVolume = useAudioVolume(stream || null);
  const isSpeakingMock = !participant.is_muted && Math.random() > 0.7;
  const isSpeaking = stream ? isSpeakingByVolume : isSpeakingMock;
  const isVideoOn = stream ? stream.getVideoTracks().length > 0 : participant.is_video_on;

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className={`relative w-full h-full bg-gray-900 rounded-xl overflow-hidden cursor-pointer ${isSpeaking ? 'ring-4 ring-green-500' : 'ring-1 ring-gray-800'}`}
      onClick={() => {
        if (isHost && !isLocalUser) {
          setShowMenu(!showMenu);
        }
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isVideoOn ? (
          stream ? (
            <VideoPlayer stream={stream} className="w-full h-full object-cover transform scale-x-[-1]" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#0B5CFF] flex items-center justify-center text-white text-5xl font-bold uppercase shadow-lg">
              {participant.display_name.charAt(0)}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-3xl font-bold uppercase mb-4">
              {participant.display_name.charAt(0)}
            </div>
            <VideoOff className="text-gray-500 w-6 h-6" />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-sm font-medium z-10">
        {participant.is_muted && <MicOff className="w-4 h-4 text-red-500" />}
        <span>{participant.display_name} {isHost && isLocalUser && "(Host)"}</span>
      </div>

      {showMenu && isHost && !isLocalUser && (
        <div 
          ref={menuRef}
          className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 w-48 z-50 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => {
              if (onToggleMute) onToggleMute(participant.id, participant.is_muted);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-gray-200 flex items-center gap-2"
          >
            {participant.is_muted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            {participant.is_muted ? "Ask to Unmute" : "Mute"}
          </button>
          <button 
            onClick={() => {
              if (onToggleVideo) onToggleVideo(participant.id, participant.is_video_on);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-gray-200 flex items-center gap-2"
          >
            {participant.is_video_on ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            {participant.is_video_on ? "Stop Video" : "Ask to Start Video"}
          </button>
          <div className="border-t border-gray-700 my-1"></div>
          <button 
            onClick={() => {
              if (onRemove) onRemove(participant.id);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-red-500 flex items-center gap-2 font-medium"
          >
            <ShieldAlert className="w-4 h-4" />
            Remove Participant
          </button>
        </div>
      )}
    </div>
  );
}
