"use client";

import { Participant } from "@/lib/types";
import { Mic, MicOff, Video, VideoOff, ShieldAlert } from "lucide-react";

interface ParticipantsSidebarProps {
  participants: Participant[];
  isHost: boolean;
  onToggleMute: (id: number, currentMuted: boolean) => void;
  onRemove: (id: number) => void;
  onMuteAll: () => void;
}

export default function ParticipantsSidebar({ 
  participants, 
  isHost,
  onToggleMute,
  onRemove,
  onMuteAll
}: ParticipantsSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm">Participants ({participants.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zoom-blue flex items-center justify-center text-white text-sm font-bold uppercase">
                {p.display_name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-800 truncate max-w-[100px]">{p.display_name}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-500">
              <button onClick={() => isHost && onToggleMute(p.id, p.is_muted)} disabled={!isHost} className={isHost ? "hover:text-gray-900" : ""}>
                {p.is_muted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4" />}
              </button>
              {p.is_video_on ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
              
              {isHost && (
                <button onClick={() => onRemove(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-500 hover:text-red-700">
                  <ShieldAlert className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onMuteAll}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
          >
            Mute All
          </button>
        </div>
      )}
    </div>
  );
}
