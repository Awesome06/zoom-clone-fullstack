"use client";

import { useState, useEffect } from "react";
import { Meeting, Participant, User } from "@/lib/types";
import { toggleParticipantMute, toggleParticipantVideo, removeParticipant, endMeeting, joinMeeting } from "@/lib/api";
import ParticipantTile from "./ParticipantTile";
import MeetingToolbar from "./MeetingToolbar";
import ParticipantsSidebar from "./ParticipantsSidebar";
import ChatSidebar from "./ChatSidebar";
import RightSidebarContainer from "./RightSidebarContainer";
import VideoPlayer from "./VideoPlayer";
import { useLocalMediaStream } from "@/hooks/useLocalMediaStream";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

/** Props required to mount the main Meeting Room UI. */
interface MeetingRoomProps {
  meeting: Meeting;
  participants: Participant[];
  currentUser: User | null;
  localParticipantId: number | null;
  initialMuted: boolean;
  initialVideoOn: boolean;
  onRefreshParticipants: () => void;
}

/**
 * Core Meeting Interface Component.
 * Orchestrates the video grid, sidebar controls, WebRTC stream handling, and participant management.
 */
export default function MeetingRoom({ meeting, participants, currentUser, localParticipantId, initialMuted, initialVideoOn, onRefreshParticipants }: MeetingRoomProps) {
  const router = useRouter();
  const [sidebar, setSidebar] = useState({ participants: false, chat: false });
  const [localMuted, setLocalMuted] = useState(initialMuted);
  const [localVideo, setLocalVideo] = useState(initialVideoOn);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [screenStream]);

  const localStream = useLocalMediaStream(localVideo, localMuted);

  const isHost = currentUser?.id === meeting.host_id;

  /** Dynamically calculate CSS grid layout based on active participant count. */
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 grid-rows-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2";
    if (count <= 9) return "grid-cols-3 grid-rows-3";
    return "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-[minmax(200px,1fr)]";
  };

  /** Toggle the audio mute state for a specific participant in the backend. */
  const handleToggleMute = async (id: number, currentMuted: boolean) => {
    try {
      await toggleParticipantMute(id, !currentMuted);
      if (id === localParticipantId) setLocalMuted(!currentMuted);
      onRefreshParticipants();
    } catch (err) {
      console.error("Failed to toggle mute", err);
    }
  };

  const handleToggleVideo = async (id: number, currentVideoOn: boolean) => {
    try {
      await toggleParticipantVideo(id, !currentVideoOn);
      if (id === localParticipantId) setLocalVideo(!currentVideoOn);
      onRefreshParticipants();
    } catch (err) {}
  };

  const handleAdmit = async (name: string) => {
    try {
      await joinMeeting(meeting.meeting_id, name);
      onRefreshParticipants();
    } catch (e) {}
  };

  const handleRemove = async (id: number) => {
    if (confirm("Remove participant?")) {
      try {
        await removeParticipant(id);
        onRefreshParticipants();
      } catch (err) {
        // Handle silently for demo
      }
    }
  };

  const handleMuteAll = async () => {
    try {
      for (const p of participants) {
        if (!p.is_muted) {
          await toggleParticipantMute(p.id, true);
          if (p.id === localParticipantId) {
            setLocalMuted(true);
          }
        }
      }
      onRefreshParticipants();
    } catch (err) {
      // Handle silently for demo
    }
  };

  const handleLeave = async () => {
    if (localParticipantId) {
      try {
        await removeParticipant(localParticipantId);
      } catch (err) {}
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    router.push("/");
  };

  const handleEndForAll = async () => {
    if (isHost) {
      try {
        for (const p of participants) {
          await removeParticipant(p.id);
        }
        await endMeeting(meeting.meeting_id);
      } catch (e) {}
    }
    await handleLeave();
  };

  return (
    <div className="flex h-full w-full bg-black overflow-hidden font-sans">
      <div className="flex-1 flex flex-col relative w-full h-full">
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="text-white">
            <h1 className="text-lg font-medium drop-shadow-md">{meeting.title}</h1>
            <p className="text-sm opacity-80 flex items-center gap-1 drop-shadow-md">
              <Info className="w-3 h-3" /> ID: {meeting.meeting_id}
            </p>
          </div>
        </div>

        <div className="flex-1 p-2 md:p-4 flex items-center justify-center overflow-hidden">
          {screenStream ? (
            <div className="w-full h-full flex flex-col gap-2">
              <div className="flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-gray-800">
                <VideoPlayer stream={screenStream} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="h-32 flex gap-2 overflow-x-auto p-1 bg-gray-900 rounded-lg shrink-0">
                {participants.map((p) => (
                  <div key={p.id} className="w-48 h-full shrink-0">
                    <ParticipantTile 
                      participant={p} 
                      isHost={meeting.host_id === currentUser?.id && p.id === localParticipantId} 
                      stream={p.id === localParticipantId ? localStream : null}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`w-full h-full max-w-7xl max-h-full grid gap-2 ${getGridClass(participants.length)}`}>
              {participants.map((p) => (
                <ParticipantTile 
                  key={p.id} 
                  participant={p} 
                  isHost={meeting.host_id === currentUser?.id} 
                  stream={p.id === localParticipantId ? localStream : null}
                  isLocalUser={p.id === localParticipantId}
                  onToggleMute={handleToggleMute}
                  onToggleVideo={handleToggleVideo}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        <MeetingToolbar 
          isMuted={localMuted}
          isVideoOn={localVideo}
          onToggleMute={async () => {
            const newMuted = !localMuted;
            setLocalMuted(newMuted);
            if (localParticipantId) {
              try {
                await toggleParticipantMute(localParticipantId, newMuted);
                onRefreshParticipants();
              } catch (e) {}
            }
          }}
          onToggleVideo={async () => {
            const newVideo = !localVideo;
            setLocalVideo(newVideo);
            if (localParticipantId) {
              try {
                await toggleParticipantVideo(localParticipantId, newVideo);
                onRefreshParticipants();
              } catch (e) {}
            }
          }}
          onToggleSidebar={(panel) => setSidebar((prev) => ({ ...prev, [panel]: !prev[panel as keyof typeof prev] }))}
          onShareScreen={(stream) => setScreenStream(stream)}
          onLeave={handleLeave}
          onEndForAll={handleEndForAll}
          isHost={isHost}
        />
      </div>

      <RightSidebarContainer 
        showParticipants={sidebar.participants}
        showChat={sidebar.chat}
        participantsComponent={
          <ParticipantsSidebar 
            participants={participants}
            isHost={isHost}
            localParticipantId={localParticipantId}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onRemove={handleRemove}
            onMuteAll={handleMuteAll}
            onAdmit={handleAdmit}
          />
        }
        chatComponent={
          <ChatSidebar currentUser={currentUser} meeting={meeting} />
        }
      />
    </div>
  );
}
