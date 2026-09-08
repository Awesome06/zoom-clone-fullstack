"use client";

import { Meeting } from "@/lib/types";
import { Calendar, Clock, Video, Pencil } from "lucide-react";

interface MeetingCardProps {
  meeting: Meeting;
  onAction?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
}

export default function MeetingCard({ meeting, onAction, onEdit }: MeetingCardProps) {
  const isUpcoming = meeting.status === 'scheduled';
  
  const getMeetingDateStr = () => meeting.scheduled_start?.endsWith('Z') ? meeting.scheduled_start : meeting.scheduled_start + 'Z';
  
  const formattedDate = meeting.scheduled_start 
    ? new Date(getMeetingDateStr()).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
    : 'Instant Meeting';
    
  const formattedTime = meeting.scheduled_start
    ? new Date(getMeetingDateStr()).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : 'Started';

  return (
    <div className="bg-white dark:bg-[#10101C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{meeting.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {meeting.meeting_id}</p>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isUpcoming ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
            {isUpcoming ? 'Upcoming' : 'Ended'}
          </div>
          {isUpcoming && onEdit && (
            <button 
              onClick={() => onEdit(meeting)} 
              className="ml-2 p-1.5 text-gray-400 hover:text-zoom-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="Edit Meeting"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 mr-2" />
          {formattedTime} • {meeting.duration_minutes} min
        </div>
      </div>
      
      {onAction && (
        <button 
          onClick={() => onAction(meeting)}
          className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isUpcoming 
              ? 'bg-zoom-blue hover:bg-zoom-blue-dark text-white' 
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
          }`}
        >
          {isUpcoming ? (
            <>
              <Video className="w-4 h-4" /> Start
            </>
          ) : 'View Details'}
        </button>
      )}
    </div>
  );
}
