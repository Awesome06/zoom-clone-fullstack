"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Meeting, Participant, User } from "@/lib/types";
import { getMeetingDetails, getParticipants, joinMeeting, getCurrentUser } from "@/lib/api";
import MeetingRoom from "@/components/MeetingRoom";

export default function MeetingPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [initialMuted, setInitialMuted] = useState(false);
  const [initialVideoOn, setInitialVideoOn] = useState(true);
  const [localParticipantId, setLocalParticipantId] = useState<number | null>(null);
  const joinAttempted = useRef(false);

  useEffect(() => {
    if (joinAttempted.current) return;
    joinAttempted.current = true;

    const initRoom = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const currentMeeting = await getMeetingDetails(id);
        setMeeting(currentMeeting);

        // Auto-join immediately
        handleJoin(currentUser?.name || "Guest", false, true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load meeting details");
        }
      } 
    };

    initRoom();
  }, [id]);

  const handleJoin = async (name: string, isMuted: boolean, isVideoOn: boolean) => {
    setLoading(true);
    setInitialMuted(isMuted);
    setInitialVideoOn(isVideoOn);
    try {
      const joinRes = await joinMeeting(id, name);
      setMeeting(joinRes.meeting);
      setLocalParticipantId(joinRes.participant_id);
      
      try {
        const recentJson = localStorage.getItem("recent_joined_meetings");
        let recent = recentJson ? JSON.parse(recentJson) : [];
        recent.unshift({ id, title: joinRes.meeting.title });
        
        // Ensure absolute uniqueness
        const uniqueRecent = Array.from(new Map(recent.map((m: any) => [m.id, m])).values());
        
        if (uniqueRecent.length > 3) recent = uniqueRecent.slice(0, 3);
        else recent = uniqueRecent;

        localStorage.setItem("recent_joined_meetings", JSON.stringify(recent));
      } catch (e) {}

      const parts = await getParticipants(id);
      setParticipants(parts);
      
      setHasJoined(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to join meeting");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hasJoined) {
    return (
      <div className="flex h-screen items-center justify-center bg-black w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-black text-white p-4 text-center">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl max-w-md w-full border border-red-500/20">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "Meeting not found"}</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-6 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="flex-1 w-full h-full relative">
        <MeetingRoom 
        meeting={meeting}
        participants={participants}
        currentUser={user}
        localParticipantId={localParticipantId}
        initialMuted={initialMuted}
        initialVideoOn={initialVideoOn}
        onRefreshParticipants={async () => {
          try {
            const parts = await getParticipants(id);
            setParticipants(parts);
          } catch (err: Error | unknown) {
            // Handle silently
          }
        }}
        />
    </div>
  );
}
