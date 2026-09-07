"use client";

import { Video, PlusSquare, Calendar } from "lucide-react";

interface ActionButtonsProps {
  onNewMeeting: () => void;
  onJoinMeeting: () => void;
  onScheduleMeeting: () => void;
}

export default function ActionButtons({ onNewMeeting, onJoinMeeting, onScheduleMeeting }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button
        onClick={onNewMeeting}
        className="flex flex-col items-center justify-center p-8 bg-zoom-orange hover:bg-[#E66E00] text-white rounded-2xl transition-all hover:scale-105 shadow-lg"
      >
        <Video className="w-12 h-12 mb-4" />
        <span className="font-semibold text-lg">New Meeting</span>
      </button>

      <button
        onClick={onJoinMeeting}
        className="flex flex-col items-center justify-center p-8 bg-[#0B5CFF] hover:bg-blue-700 text-white rounded-2xl transition-all hover:scale-105 shadow-lg"
      >
        <PlusSquare className="w-12 h-12 mb-4" />
        <span className="font-semibold text-lg">Join</span>
      </button>

      <button
        onClick={onScheduleMeeting}
        className="flex flex-col items-center justify-center p-8 bg-zoom-purple hover:bg-[#7D3C98] text-white rounded-2xl transition-all hover:scale-105 shadow-lg"
      >
        <Calendar className="w-12 h-12 mb-4" />
        <span className="font-semibold text-lg text-white">Schedule</span>
      </button>
    </div>
  );
}
