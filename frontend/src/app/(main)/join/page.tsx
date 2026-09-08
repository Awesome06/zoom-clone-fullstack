"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

/**
 * Join Meeting Page.
 * Allows users to manually type or paste a meeting ID to join.
 * Maintains a local-storage history of recently joined meetings for quick access.
 */
export default function JoinPage() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState("");
  const [recentMeetings, setRecentMeetings] = useState<{id: string, title: string}[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** On mount, load recent meetings history and setup click-outside listener. */
  useEffect(() => {
    try {
      const recent = localStorage.getItem("recent_joined_meetings");
      if (recent) setRecentMeetings(JSON.parse(recent));
    } catch(e) {}

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handle form submission. Extracts the raw ID if the user pasted a full URL.
   */
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId.trim()) return;

    const extractedId = meetingId.includes("/meeting/") 
      ? meetingId.split("/meeting/")[1].trim()
      : meetingId.trim();

    router.push(`/meeting/${extractedId}`);
  };

  const isJoinDisabled = meetingId.trim().length === 0;

  return (
    <div className="h-full w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Join Meeting</h1>
        
        <form onSubmit={handleJoin} className="space-y-6 relative">
          <div className="relative" ref={dropdownRef}>
            <input 
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              onFocus={() => setShowRecent(true)}
              placeholder="Meeting ID or Personal Link Name"
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#0B5CFF] focus:border-[#0B5CFF] outline-none transition-shadow text-lg"
            />
            <button 
              type="button" 
              onClick={() => setShowRecent(!showRecent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            {showRecent && recentMeetings.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">Recent Meetings</div>
                {recentMeetings.map((m) => (
                  <div 
                    key={m.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col transition-colors border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setMeetingId(m.id);
                      setShowRecent(false);
                    }}
                  >
                    <span className="font-medium text-gray-900">{m.title}</span>
                    <span className="text-sm text-gray-500">{m.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isJoinDisabled}
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${isJoinDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0B5CFF] text-white hover:bg-blue-700'}`}
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
