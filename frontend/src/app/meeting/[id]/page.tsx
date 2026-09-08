"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Meeting, Participant, User } from "@/lib/types";
import { getMeetingDetails, getParticipants, joinMeeting, getCurrentUser } from "@/lib/api";
import MeetingRoom from "@/components/MeetingRoom";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

/**
 * Meeting Room Entry Page.
 * Responsible for verifying the meeting exists, prompting the user for their display name,
 * and subsequently wrapping the main MeetingRoom component.
 */
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
  const [displayName, setDisplayName] = useState("");
  const joinAttempted = useRef(false);

  /** Fetch meeting details and current user on mount to prepare the preview screen. */
  useEffect(() => {
    if (joinAttempted.current) return;
    joinAttempted.current = true;

    const initRoom = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser?.name) {
          setDisplayName(currentUser.name);
        }

        const currentMeeting = await getMeetingDetails(id);
        setMeeting(currentMeeting);
        
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load meeting details");
        }
        setLoading(false);
      } 
    };

    initRoom();
  }, [id]);

  /**
   * Register the participant in the backend and load the main meeting interface.
   * Tracks this meeting in the local storage history.
   */
  const handleJoin = async (name: string, isMuted: boolean, isVideoOn: boolean) => {
    setLoading(true);
    setInitialMuted(isMuted);
    setInitialVideoOn(isVideoOn);
    try {
      const joinRes = await joinMeeting(id, name, isMuted, isVideoOn);
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



  if (!hasJoined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F3F4F6] p-6 h-full w-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join {meeting.title}</h1>
          <p className="text-gray-500 text-sm mb-8">Choose your audio and video settings</p>

          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-gray-700">Your Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent text-gray-900 font-medium transition-all"
                required
              />
            </div>

            <div className="flex gap-4 justify-center py-2">
              <button 
                onClick={() => setInitialMuted(!initialMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${initialMuted ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {initialMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setInitialVideoOn(!initialVideoOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${!initialVideoOn ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {!initialVideoOn ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </button>
            </div>

            <button 
              onClick={() => handleJoin(displayName || "Guest", initialMuted, initialVideoOn)}
              disabled={!displayName.trim()}
              className="w-full py-3 bg-[#0B5CFF] hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
            >
              Join Meeting
            </button>
          </div>
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
