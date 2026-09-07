"use client";

import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, PhoneOff } from "lucide-react";

interface MeetingToolbarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSidebar: () => void;
  onLeave: () => void;
  isHost: boolean;
}

export default function MeetingToolbar({ 
  isMuted, 
  isVideoOn, 
  onToggleMute, 
  onToggleVideo, 
  onToggleSidebar, 
  onLeave,
  isHost
}: MeetingToolbarProps) {
  return (
    <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleMute}
          className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${isMuted ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-800'}`}
        >
          {isMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
          <span className="text-xs font-medium">{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        <button 
          onClick={onToggleVideo}
          className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${!isVideoOn ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-800'}`}
        >
          {!isVideoOn ? <VideoOff className="w-5 h-5 mb-1" /> : <Video className="w-5 h-5 mb-1" />}
          <span className="text-xs font-medium">{!isVideoOn ? "Start Video" : "Stop Video"}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 hidden md:flex">
        <button 
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Participants</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors">
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-green-500 hover:bg-green-500/10 transition-colors">
          <Share className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Share Screen</span>
        </button>
      </div>

      <div className="flex md:hidden">
         <button 
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Users</span>
        </button>
      </div>

      <div>
        <button 
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">{isHost ? "End Meeting" : "Leave"}</span>
        </button>
      </div>
    </div>
  );
}
