export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

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

export interface InstantMeetingResponse {
  meeting_id: string;
  invite_link: string;
  status: string;
}

export interface Participant {
  id: number;
  meeting_id: number;
  display_name: string;
  joined_at: string;
  is_muted: boolean;
  is_video_on: boolean;
}

export interface JoinMeetingResponse {
  meeting: Meeting;
  participant_id: number;
}
