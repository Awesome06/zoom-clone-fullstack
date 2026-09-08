"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Plus, Calendar, Info, RefreshCw, Clock, Pencil } from "lucide-react";
import { createInstantMeeting, getUpcomingMeetings, getRecentMeetings } from "@/lib/api";
import { Meeting } from "@/lib/types";
import ScheduleModal from "@/components/ScheduleModal";
import EditMeetingModal from "@/components/EditMeetingModal";

/**
 * Main Dashboard View.
 * Displays the current time, quick action buttons (New, Join, Schedule),
 * and dynamically fetches and displays upcoming and recent meetings.
 */
export default function HomeView() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  const [isScheduleOpen, setScheduleOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);

  /** Fetch upcoming and recent meetings from the backend. */
  const fetchMeetings = async () => {
    setLoadingMeetings(true);
    try {
      const [upcoming, recent] = await Promise.all([getUpcomingMeetings(), getRecentMeetings()]);
      setUpcomingMeetings(upcoming);
      setRecentMeetings(recent);
    } catch (e) {
      console.error("Failed to load meetings", e);
    } finally {
      setLoadingMeetings(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /** Create an instant meeting and automatically route the user to the new room. */
  const handleNewMeeting = async () => {
    try {
      const { meeting_id } = await createInstantMeeting();
      router.push(`/meeting/${meeting_id}`);
    } catch (err) {
      console.error("Failed to create instant meeting", err);
    }
  };



  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-6xl font-light text-gray-900 mb-2 tracking-tight">{currentTime || '\u00A0'}</h2>
        <p className="text-lg text-gray-500 font-medium">{currentDate || '\u00A0'}</p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-10 mb-8">
        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleNewMeeting}>
          <div className="w-[72px] h-[72px] bg-zoom-orange hover:bg-[#D95F1A] text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all relative">
            <Video className="w-8 h-8" />
            {/* Split button chevron simulation */}
            <div className="absolute right-1 bottom-1 w-4 h-4 bg-black/10 rounded flex items-center justify-center">
              <ChevronDown className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-[13px] font-medium text-gray-700">New meeting</span>
        </div>

        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => router.push('/join')}>
          <div className="w-[72px] h-[72px] bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-[13px] font-medium text-gray-700">Join</span>
        </div>

        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setScheduleOpen(true)}>
          <div className="w-[72px] h-[72px] bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all">
            <Calendar className="w-7 h-7 mb-0.5" />
          </div>
          <span className="text-[13px] font-medium text-gray-700">Schedule</span>
        </div>
      </div>

      {/* Calendar Banner */}
      <div className="w-full max-w-3xl mb-8 bg-[#F0F6FF] border border-[#BCE1FC] rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-zoom-blue shrink-0 mt-0.5" />
        <p className="text-[13px] text-gray-700 leading-snug">
          You haven&apos;t connected your calendar yet. <button className="text-zoom-blue hover:underline">Connect now</button> to manage all your meetings and events in one place.
        </p>
      </div>

      {/* Meetings Panels */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 mb-10">
        {/* Upcoming Meetings Panel */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[360px] shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-[15px]">
              <Calendar className="w-4 h-4 text-zoom-blue" />
              Upcoming
            </h3>
            <button onClick={fetchMeetings} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loadingMeetings ? 'animate-spin text-zoom-blue' : ''}`} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingMeetings ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zoom-blue"></div>
              </div>
            ) : upcomingMeetings.length > 0 ? (
              <div className="flex flex-col">
                {upcomingMeetings.map(m => (
                  <div key={m.id} className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                    <div>
                      <div className="font-semibold text-gray-900 text-[15px] group-hover:text-zoom-blue transition-colors line-clamp-1">{m.title}</div>
                      <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-3 font-medium">
                        <span className="text-gray-700">{m.scheduled_start ? new Date(m.scheduled_start.endsWith('Z') ? m.scheduled_start : m.scheduled_start + 'Z').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Time TBD'}</span>
                        <span className="opacity-50">|</span>
                        <span>ID: {m.meeting_id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4 shrink-0">
                      <button 
                        onClick={() => setEditMeeting(m)}
                        className="p-2 text-gray-500 hover:text-zoom-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Meeting"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => router.push(`/meeting/${m.meeting_id}`)}
                        className="px-5 py-2 bg-zoom-blue hover:bg-zoom-blue-dark text-white text-[13px] font-semibold rounded-lg shadow-sm"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-zoom-blue" />
                </div>
                <span className="text-sm text-gray-600 font-medium">No upcoming meetings</span>
                <span className="text-[13px] text-gray-400 mt-1">Schedule one to get started</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Meetings Panel */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[360px] shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-[15px]">
              <Clock className="w-4 h-4 text-gray-500" />
              Recent
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingMeetings ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zoom-blue"></div>
              </div>
            ) : recentMeetings.length > 0 ? (
              <div className="flex flex-col">
                {recentMeetings.map(m => (
                  <div key={m.id} className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                    <div>
                      <div className="font-semibold text-gray-900 text-[15px] line-clamp-1">{m.title}</div>
                      <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-3 font-medium">
                        <span>{(m.scheduled_start || m.created_at) ? new Date((m.scheduled_start || m.created_at!).endsWith('Z') ? (m.scheduled_start || m.created_at!) : (m.scheduled_start || m.created_at!) + 'Z').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Date TBD'}</span>
                        <span className="opacity-50">|</span>
                        <span>ID: {m.meeting_id}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/meeting/${m.meeting_id}`)}
                      className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-[13px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm shrink-0 ml-4"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-sm text-gray-600 font-medium">No recent meetings</span>
                <span className="text-[13px] text-gray-400 mt-1">Join a meeting to see history</span>
              </div>
            )}
          </div>
        </div>
      </div>



      <ScheduleModal 
        isOpen={isScheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={() => {
          fetchMeetings();
        }}
      />

      <EditMeetingModal
        isOpen={!!editMeeting}
        onClose={() => setEditMeeting(null)}
        meeting={editMeeting}
        onEdited={() => {
          fetchMeetings();
        }}
      />
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}
