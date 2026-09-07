"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (meetingId: string, displayName: string) => void;
}

export default function JoinModal({ isOpen, onClose, onJoin }: JoinModalProps) {
  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!meetingId.trim()) {
      setError("Please enter a meeting ID or link");
      return;
    }
    if (!displayName.trim()) {
      setError("Please enter your name");
      return;
    }

    const extractedId = meetingId.includes("/meeting/") 
      ? meetingId.split("/meeting/")[1].trim()
      : meetingId.trim();

    onJoin(extractedId, displayName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#10101C] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold">Join a Meeting</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meeting ID or Link</label>
            <input 
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="e.g. abc-defg-hij"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-zoom-blue outline-none transition-shadow"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input 
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-zoom-blue outline-none transition-shadow"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3 bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-lg font-medium transition-colors"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
