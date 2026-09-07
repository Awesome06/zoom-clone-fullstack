"use client";

import { Meeting } from "@/lib/types";
import { Calendar, Clock, Video } from "lucide-react";

interface MeetingCardProps {
  meeting: Meeting;
  onAction?: (meeting: Meeting) => void;
}

export default function MeetingCard({ meeting, onAction }: MeetingCardProps) {
  const isUpcoming = meeting.status === 'scheduled';
  
  const formattedDate = meeting.scheduled_start 
    ? new Date(meeting.scheduled_start).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
    : 'Instant Meeting';
    
  const formattedTime = meeting.scheduled_start
    ? new Date(meeting.scheduled_start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : 'Started';

  return (
    <div className="bg-white dark:bg-[#10101C] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{meeting.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {meeting.meeting_id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${isUpcoming ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
          {isUpcoming ? 'Upcoming' : 'Ended'}
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
