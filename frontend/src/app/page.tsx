"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Meeting } from "@/lib/types";
import { getUpcomingMeetings, getRecentMeetings, createInstantMeeting } from "@/lib/api";
import ActionButtons from "@/components/ActionButtons";
import MeetingList from "@/components/MeetingList";
import JoinModal from "@/components/JoinModal";
import ScheduleModal from "@/components/ScheduleModal";

export default function Dashboard() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const [isJoinOpen, setJoinOpen] = useState(false);
  const [isScheduleOpen, setScheduleOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const fetchMeetings = async () => {
    try {
      const [up, rec] = await Promise.all([
        getUpcomingMeetings(),
        getRecentMeetings()
      ]);
      setUpcoming(up);
      setRecent(rec);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();

    // Set initial date/time on the client
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setCurrentDate(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleNewMeeting = async () => {
    try {
      const { meeting_id } = await createInstantMeeting();
      router.push(`/meeting/${meeting_id}`);
    } catch (err) {
      console.error("Failed to start instant meeting", err);
    }
  };

  const handleJoinSubmit = (meetingId: string, displayName: string) => {
    sessionStorage.setItem("join_display_name", displayName);
    router.push(`/meeting/${meetingId}`);
  };

  const handleMeetingAction = (meeting: Meeting) => {
    if (meeting.status === 'scheduled') {
      router.push(`/meeting/${meeting.meeting_id}`);
    } else {
      alert(`Details for: ${meeting.title}`);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8">
      <div className="bg-zoom-blue text-white rounded-3xl p-8 mb-8 shadow-lg bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070')] bg-cover bg-center bg-blend-overlay min-h-[160px] flex flex-col justify-center">
        <h2 className="text-4xl font-light mb-2">{currentTime}</h2>
        <p className="text-xl font-medium opacity-90">{currentDate}</p>
      </div>

      <ActionButtons
        onNewMeeting={handleNewMeeting}
        onJoinMeeting={() => setJoinOpen(true)}
        onScheduleMeeting={() => setScheduleOpen(true)}
      />

      <div className="mt-12">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zoom-blue"></div>
          </div>
        ) : (
          <MeetingList
            upcomingMeetings={upcoming}
            recentMeetings={recent}
            onMeetingAction={handleMeetingAction}
          />
        )}
      </div>

      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setJoinOpen(false)}
        onJoin={handleJoinSubmit}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={() => {
          fetchMeetings();
        }}
      />
    </div>
  );
}
