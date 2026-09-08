/**
 * TypeScript definitions for the Zoom Clone frontend.
 * Ensure parity with backend Pydantic schemas.
 */

/** Represents a registered user. */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

/** Represents a meeting instance. */
export interface Meeting {
  id: number;
  meeting_id: string;
  title: string;
  description: string | null;
  host_id: number;
  is_instant: boolean;
  status: 'scheduled' | 'active' | 'ended';
  scheduled_start: string | null;
  duration_minutes: number;
  invite_link: string;
  created_at: string;
}

/** Data returned when instantly creating a meeting. */
export interface InstantMeetingResponse {
  meeting_id: string;
  invite_link: string;
  status: string;
}

/** Represents a participant currently in a meeting room. */
export interface Participant {
  id: number;
  meeting_id: number;
  display_name: string;
  joined_at: string;
  is_muted: boolean;
  is_video_on: boolean;
}

/** Payload returned after successfully joining a room. */
export interface JoinMeetingResponse {
  meeting: Meeting;
  participant_id: number;
}

/** Represents a persisted chat message within a meeting room. */
export interface ChatMessage {
  id: number;
  meeting_id: number;
  sender_name: string;
  text: string;
  timestamp: string;
}
