"use client";

import { Participant } from "@/lib/types";
import { Mic, MicOff, Video, VideoOff, X, ShieldAlert } from "lucide-react";

interface ParticipantsSidebarProps {
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  isHost: boolean;
  onToggleMute: (id: number, currentMuted: boolean) => void;
  onRemove: (id: number) => void;
  onMuteAll: () => void;
}

export default function ParticipantsSidebar({ 
  participants, 
  isOpen, 
  onClose, 
  isHost,
  onToggleMute,
  onRemove,
  onMuteAll
}: ParticipantsSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 h-full bg-white dark:bg-[#10101C] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-20 absolute right-0 md:relative">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold">Participants ({participants.length})</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg group transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zoom-blue flex items-center justify-center text-white text-sm font-bold uppercase">
                {p.display_name.charAt(0)}
              </div>
              <span className="text-sm font-medium truncate max-w-[100px]">{p.display_name}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-500">
              <button onClick={() => isHost && onToggleMute(p.id, p.is_muted)} disabled={!isHost} className={isHost ? "hover:text-gray-900 dark:hover:text-gray-100" : ""}>
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#10101C]">
          <button 
            onClick={onMuteAll}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            Mute All
          </button>
        </div>
      )}
    </div>
  );
}
