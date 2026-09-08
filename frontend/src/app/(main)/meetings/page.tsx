"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Calendar, Copy, Edit3, Eye, MessageSquare, Trash2, Pencil } from "lucide-react";
import { createInstantMeeting, getUpcomingMeetings, deleteMeeting } from "@/lib/api";
import { Meeting } from "@/lib/types";
import { useRouter } from "next/navigation";
import EditMeetingModal from "@/components/EditMeetingModal";

// Helper to group meetings chronologically
const groupMeetings = (meetings: Meeting[]) => {
  const groups: { [key: string]: Meeting[] } = {};
  
  meetings.forEach(m => {
    if (!m.scheduled_start) return;
    const dateStr = m.scheduled_start.endsWith('Z') ? m.scheduled_start : m.scheduled_start + 'Z';
    const d = new Date(dateStr);
    
    // Determine label
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    
    if (d.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (d.toDateString() === tomorrow.toDateString()) {
      label = "Tomorrow";
    }
    
    if (!groups[label]) groups[label] = [];
    groups[label].push(m);
  });
  
  return groups;
};

export default function MeetingsView() {
  const router = useRouter();
  const pmi = "703 768 6404";
  
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  
  const [editMeetingModalOpen, setEditMeetingModalOpen] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const upcoming = await getUpcomingMeetings();
      setUpcomingMeetings(upcoming);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleStartPmi = async () => {
    try {
      const { meeting_id } = await createInstantMeeting();
      router.push(`/meeting/${meeting_id}`);
    } catch (e) {}
  };

  const handleStartMeeting = (meeting_id: string) => {
    router.push(`/meeting/${meeting_id}`);
  };

  const handleDelete = async (meeting_id: string) => {
    try {
      await deleteMeeting(meeting_id);
      if (activeMeetingId === meeting_id) {
        setActiveMeetingId(null);
      }
      fetchMeetings();
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };
  
  const handleCopy = (inviteLink: string) => {
    navigator.clipboard.writeText(inviteLink);
  };

  const groupedMeetings = groupMeetings(upcomingMeetings);
  const activeMeeting = upcomingMeetings.find(m => m.meeting_id === activeMeetingId);

  return (
    <div className="flex h-full w-full bg-white">
      {/* Secondary Sidebar (List) */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full shrink-0">
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
          <span className="font-semibold text-gray-800">Upcoming</span>
          <button onClick={fetchMeetings} className="text-gray-500 hover:text-gray-700">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-zoom-blue' : ''}`} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {/* Active PMI Card */}
          <div 
            onClick={() => setActiveMeetingId(null)}
            className={`rounded-lg p-4 shadow-sm cursor-pointer relative overflow-hidden transition-colors ${activeMeetingId === null ? 'bg-[#0B5CFF] text-white' : 'bg-white hover:bg-gray-50 border-b border-gray-200'}`}
          >
            {activeMeetingId === null && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>}
            <h3 className={`font-medium text-sm mb-1 ${activeMeetingId === null ? '' : 'text-gray-900'}`}>My Personal Meeting ID (PMI)</h3>
            <p className={`text-xl font-light tracking-wider opacity-90 ${activeMeetingId === null ? '' : 'text-gray-600'}`}>{pmi}</p>
          </div>

          {upcomingMeetings.length === 0 && !loading && (
            <div className="mt-8 flex flex-col items-center justify-center opacity-60">
              <Calendar className="w-10 h-10 text-gray-400 mb-3 stroke-[1.5]" />
              <p className="text-sm text-gray-500">No upcoming meetings</p>
            </div>
          )}

          {Object.entries(groupedMeetings).map(([label, meetings]) => (
            <div key={label} className="mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">{label}</div>
              <div className="flex flex-col gap-1">
                {meetings.map(m => {
                  const isActive = activeMeetingId === m.meeting_id;
                  const dateStr = m.scheduled_start?.endsWith('Z') ? m.scheduled_start : m.scheduled_start + 'Z';
                  const d = new Date(dateStr);
                  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div 
                      key={m.id}
                      onClick={() => setActiveMeetingId(m.meeting_id)}
                      className={`rounded-lg p-3 cursor-pointer transition-colors ${isActive ? 'bg-[#0B5CFF] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <h3 className={`font-medium text-[15px] truncate ${isActive ? '' : 'text-gray-900'}`}>{m.title}</h3>
                      <div className={`text-xs mt-1 font-medium flex items-center gap-2 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        <span>{timeStr}</span>
                        <span>|</span>
                        <span>ID: {m.meeting_id}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
            <Calendar className="w-4 h-4" />
            + Add a calendar
          </button>
        </div>
      </div>

      {/* Main Content Area (Details) */}
      <div className="flex-1 bg-white flex flex-col pt-16 px-16 overflow-y-auto">
        {!activeMeeting ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Personal Meeting ID (PMI)</h1>
            <p className="text-4xl font-light text-gray-800 mb-8 tracking-wide">{pmi}</p>

            <div className="flex items-center gap-3 mb-6">
              <button onClick={handleStartPmi} className="bg-zoom-blue hover:bg-zoom-blue-dark text-white px-8 py-2 rounded-lg font-medium shadow-sm transition-colors">
                Start
              </button>
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Copy className="w-4 h-4 text-gray-500" />
                Copy Invitation
              </button>
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Edit3 className="w-4 h-4 text-gray-500" />
                Edit
              </button>
            </div>

            <button className="text-zoom-blue hover:underline text-sm font-medium self-start flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              Show Meeting Invitation
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{activeMeeting.title}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Time</span>
                <span className="text-base text-gray-900">
                  {(() => {
                    const dateStr = activeMeeting.scheduled_start?.endsWith('Z') ? activeMeeting.scheduled_start : activeMeeting.scheduled_start + 'Z';
                    const d = new Date(dateStr);
                    const dEnd = new Date(d.getTime() + activeMeeting.duration_minutes * 60000);
                    return `${d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} ⋅ ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${dEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  })()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Meeting ID</span>
                <span className="text-base text-gray-900 font-medium">{activeMeeting.meeting_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">Description</span>
                <span className="text-base text-gray-900">{activeMeeting.description || "No description"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button onClick={() => handleStartMeeting(activeMeeting.meeting_id)} className="bg-zoom-blue hover:bg-zoom-blue-dark text-white px-8 py-2 rounded-lg font-medium shadow-sm transition-colors">
                Start
              </button>
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Message Invitees
              </button>
              <button onClick={() => handleCopy(activeMeeting.invite_link)} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Copy className="w-4 h-4 text-gray-500" />
                Copy Invitation
              </button>
              <button onClick={() => setEditMeetingModalOpen(true)} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Pencil className="w-4 h-4 text-gray-500" />
                Edit
              </button>
              <button onClick={() => handleDelete(activeMeeting.meeting_id)} className="bg-white border border-gray-300 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete
              </button>
            </div>

            <button className="text-zoom-blue hover:underline text-sm font-medium self-start flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              Show Meeting Invitation
            </button>
          </>
        )}
      </div>

      <EditMeetingModal
        isOpen={editMeetingModalOpen}
        onClose={() => setEditMeetingModalOpen(false)}
        meeting={activeMeeting || null}
        onEdited={() => fetchMeetings()}
      />
    </div>
  );
}
