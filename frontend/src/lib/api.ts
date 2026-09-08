/**
 * API service layer for communicating with the FastAPI backend.
 * Uses a centralized fetchApi helper for DRY requests.
 */

import { Meeting, InstantMeetingResponse, JoinMeetingResponse, Participant, User } from './types';

const API_BASE = '/api';

/**
 * Generic fetch wrapper to handle errors, JSON parsing, and boilerplate.
 * @param endpoint The API path (e.g., `/users/me`)
 * @param options Fetch options (method, body, headers)
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`API Error (${res.status}): ${errText}`);
  }
  
  // Return empty string/null for 204 No Content
  if (res.status === 204) return null as any as T;
  return res.json();
}

/** Retrieve the current authenticated user profile. */
export const getCurrentUser = () => fetchApi<User>('/users/me');

/** Get chronologically ordered upcoming meetings for the dashboard. */
export const getUpcomingMeetings = () => fetchApi<Meeting[]>('/meetings/upcoming');

/** Get reverse-chronologically ordered past/ended meetings. */
export const getRecentMeetings = () => fetchApi<Meeting[]>('/meetings/recent');

/** Instantly spin up a new active meeting room. */
export const createInstantMeeting = () => fetchApi<InstantMeetingResponse>('/meetings/instant', { method: 'POST' });

/** Schedule a future meeting. */
export const scheduleMeeting = (data: { title: string; description?: string; scheduled_start: string; duration_minutes: number }) => 
  fetchApi<Meeting>('/meetings/schedule', { method: 'POST', body: JSON.stringify(data) });

/** Get full details of a specific meeting by its public string ID. */
export const getMeetingDetails = (meetingId: string) => fetchApi<Meeting>(`/meetings/${meetingId}`);

/** Join an existing meeting and register as a participant. */
export const joinMeeting = (meetingId: string, displayName: string, isMuted: boolean = false, isVideoOn: boolean = true) => 
  fetchApi<JoinMeetingResponse>(`/meetings/${meetingId}/join`, { 
    method: 'POST', 
    body: JSON.stringify({ meeting_id: meetingId, display_name: displayName, is_muted: isMuted, is_video_on: isVideoOn }) 
  });

/** Get the list of current active participants in a room. */
export const getParticipants = (meetingId: string) => fetchApi<Participant[]>(`/participants/${meetingId}`);

/** Toggle the microphone state for a specific participant. */
export const toggleParticipantMute = (participantId: number, isMuted: boolean) => 
  fetchApi<Participant>(`/participants/${participantId}/toggle-mute`, { method: 'PATCH', body: JSON.stringify({ is_muted: isMuted }) });

/** Toggle the camera state for a specific participant. */
export const toggleParticipantVideo = (participantId: number, isVideoOn: boolean) => 
  fetchApi<Participant>(`/participants/${participantId}/toggle-mute`, { method: 'PATCH', body: JSON.stringify({ is_video_on: isVideoOn }) });

/** Remove a participant from the room (kick or leave). */
export const removeParticipant = (participantId: number) => 
  fetchApi<void>(`/participants/${participantId}`, { method: 'DELETE' });

/** Terminate a meeting (Host only). */
export const endMeeting = (meetingId: string) => 
  fetchApi<Meeting>(`/meetings/${meetingId}/end`, { method: 'PATCH' });
