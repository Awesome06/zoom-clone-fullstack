import { Meeting, InstantMeetingResponse, JoinMeetingResponse, Participant, User } from './types';

const API_BASE = '/api';

export async function getCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/users/me`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function getUpcomingMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE}/meetings/upcoming`);
  if (!res.ok) throw new Error('Failed to fetch upcoming meetings');
  return res.json();
}

export async function getRecentMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE}/meetings/recent`);
  if (!res.ok) throw new Error('Failed to fetch recent meetings');
  return res.json();
}

export async function createInstantMeeting(): Promise<InstantMeetingResponse> {
  const res = await fetch(`${API_BASE}/meetings/instant`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to create instant meeting');
  return res.json();
}

export async function scheduleMeeting(data: { title: string; description?: string; scheduled_start: string; duration_minutes: number }): Promise<Meeting> {
  const res = await fetch(`${API_BASE}/meetings/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to schedule meeting');
  return res.json();
}

export async function getMeetingDetails(meetingId: string): Promise<Meeting> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}`);
  if (!res.ok) throw new Error('Failed to fetch meeting details');
  return res.json();
}

export async function joinMeeting(meetingId: string, displayName: string): Promise<JoinMeetingResponse> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meeting_id: meetingId, display_name: displayName }),
  });
  if (!res.ok) throw new Error('Failed to join meeting');
  return res.json();
}

export async function getParticipants(meetingId: string): Promise<Participant[]> {
  const res = await fetch(`${API_BASE}/participants/${meetingId}`);
  if (!res.ok) throw new Error('Failed to fetch participants');
  return res.json();
}

export async function toggleParticipantMute(participantId: number, isMuted: boolean): Promise<Participant> {
  const res = await fetch(`${API_BASE}/participants/${participantId}/toggle-mute`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_muted: isMuted }),
  });
  if (!res.ok) throw new Error('Failed to toggle mute');
  return res.json();
}

export async function toggleParticipantVideo(participantId: number, isVideoOn: boolean): Promise<Participant> {
  const res = await fetch(`${API_BASE}/participants/${participantId}/toggle-mute`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_video_on: isVideoOn }),
  });
  if (!res.ok) throw new Error('Failed to toggle video');
  return res.json();
}

export async function removeParticipant(participantId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/participants/${participantId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove participant');
}

export async function endMeeting(meetingId: string): Promise<Meeting> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/end`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to end meeting');
  return res.json();
}
