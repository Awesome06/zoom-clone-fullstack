"use client";

import { useEffect, useState } from "react";
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

  const loadRoom = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      let currentMeeting = await getMeetingDetails(id);
      const displayName = sessionStorage.getItem("join_display_name") || currentUser.name;
      
      const joinRes = await joinMeeting(id, displayName);
      currentMeeting = joinRes.meeting;
      
      setMeeting(currentMeeting);
      sessionStorage.removeItem("join_display_name");

      const parts = await getParticipants(id);
      setParticipants(parts);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load meeting room");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, [id]);

  if (loading) {
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
    <div className="absolute inset-0 z-50 bg-black">
        <MeetingRoom 
        meeting={meeting}
        participants={participants}
        currentUser={user}
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
