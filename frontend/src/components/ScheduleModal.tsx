"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { scheduleMeeting } from "@/lib/api";
import { Meeting } from "@/lib/types";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
}

export default function ScheduleModal({ isOpen, onClose, onScheduled }: ScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !date || !time) {
      setError("Please fill in all required fields");
      return;
    }

    const dateTimeString = `${date}T${time}:00`;
    const scheduled_start = new Date(dateTimeString).toISOString();

    setLoading(true);
    try {
      const meeting = await scheduleMeeting({
        title,
        scheduled_start,
        duration_minutes: parseInt(duration)
      });
      onScheduled(meeting);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to schedule meeting");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#094AC2] text-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up border border-blue-800">
        <div className="flex items-center justify-between p-6 border-b border-blue-400/30">
          <h2 className="text-xl font-semibold">Schedule Meeting</h2>
          <button onClick={onClose} className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Sync"
              className="w-full px-4 py-2 rounded-lg border border-transparent bg-white/10 text-white placeholder-blue-200 focus:ring-2 focus:ring-white outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-transparent bg-white/10 text-white focus:ring-2 focus:ring-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-transparent bg-white/10 text-white focus:ring-2 focus:ring-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-transparent bg-white/10 text-white focus:ring-2 focus:ring-white outline-none [&>option]:bg-[#094AC2]"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {error && <p className="text-red-200 bg-red-500/20 px-3 py-2 rounded-lg text-sm">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-white text-[#094AC2] hover:bg-blue-50 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
