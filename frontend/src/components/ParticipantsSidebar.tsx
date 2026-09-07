"use client";

import { Participant } from "@/lib/types";
import { Mic, MicOff, Video, VideoOff, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";

interface ParticipantsSidebarProps {
  participants: Participant[];
  isHost: boolean;
  localParticipantId: number | null;
  onToggleMute: (id: number, currentMuted: boolean) => void;
  onToggleVideo: (id: number, currentVideoOn: boolean) => void;
  onRemove: (id: number) => void;
  onMuteAll: () => void;
  onAdmit?: (name: string) => void;
}

export default function ParticipantsSidebar({ 
  participants, 
  isHost,
  localParticipantId,
  onToggleMute,
  onToggleVideo,
  onRemove,
  onMuteAll,
  onAdmit
}: ParticipantsSidebarProps) {
  const [waitingUsers, setWaitingUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (isHost) {
      const count = Math.floor(Math.random() * 5) + 1;
      const letters = ["A", "B", "C", "D", "E"];
      const generated = Array.from({ length: count }).map((_, i) => ({
        id: `wait-${i}`,
        name: `User ${letters[i]}`
      }));
      setWaitingUsers(generated);
    }
  }, [isHost]);

  return (
    <div className="flex flex-col h-full bg-white">
      {isHost && waitingUsers.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50/50">
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">Waiting Room</h3>
            <button 
              onClick={() => {
                if (onAdmit) {
                  waitingUsers.forEach(u => onAdmit(u.name));
                }
                setWaitingUsers([]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0B5CFF] hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors"
            >
              Allow Participants in
              <span className="w-4 h-4 bg-white text-[#0B5CFF] rounded-full flex items-center justify-center font-bold text-[10px]">
                {waitingUsers.length}
              </span>
            </button>
          </div>
          <div className="px-2 pb-2">
            {waitingUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-2 hover:bg-white rounded-lg group transition-colors border border-transparent hover:border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold uppercase">
                    {u.name.split(' ')[1]}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{u.name}</span>
                </div>
                <button 
                  onClick={() => {
                    if (onAdmit) onAdmit(u.name);
                    setWaitingUsers(waitingUsers.filter(w => w.id !== u.id));
                  }}
                  className="px-3 py-1.5 border border-[#0B5CFF] text-[#0B5CFF] text-xs font-medium rounded-md hover:bg-blue-50 transition-colors"
                >
                  Admit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <button 
                onClick={() => (isHost || p.id === localParticipantId) && onToggleMute(p.id, p.is_muted)} 
                disabled={!isHost && p.id !== localParticipantId} 
                className={(isHost || p.id === localParticipantId) ? "hover:text-gray-900" : ""}
              >
                {p.is_muted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => (isHost || p.id === localParticipantId) && onToggleVideo(p.id, p.is_video_on)} 
                disabled={!isHost && p.id !== localParticipantId} 
                className={(isHost || p.id === localParticipantId) ? "hover:text-gray-900" : ""}
              >
                {p.is_video_on ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
              </button>
              
              {isHost && p.id !== localParticipantId && (
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
