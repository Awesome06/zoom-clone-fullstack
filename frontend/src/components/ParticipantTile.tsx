"use client";

import { Participant } from "@/lib/types";
import { MicOff, VideoOff } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useAudioVolume } from "@/hooks/useAudioVolume";

interface ParticipantTileProps {
  participant: Participant;
  isHost?: boolean;
  stream?: MediaStream | null;
}

export default function ParticipantTile({ participant, isHost, stream }: ParticipantTileProps) {
  const isSpeakingByVolume = useAudioVolume(stream || null);
  const isSpeakingMock = !participant.is_muted && Math.random() > 0.7;
  const isSpeaking = stream ? isSpeakingByVolume : isSpeakingMock;
  const isVideoOn = stream ? stream.getVideoTracks().length > 0 : participant.is_video_on;

  return (
    <div className={`relative w-full h-full bg-gray-900 rounded-xl overflow-hidden ${isSpeaking ? 'ring-4 ring-green-500' : 'ring-1 ring-gray-800'}`}>
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

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-sm font-medium">
        {participant.is_muted && <MicOff className="w-4 h-4 text-red-500" />}
        <span>{participant.display_name} {isHost && "(Host)"}</span>
      </div>
    </div>
  );
}
