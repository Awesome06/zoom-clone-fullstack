"use client";

import { useState } from "react";
import { Meeting } from "@/lib/types";
import MeetingCard from "./MeetingCard";

interface MeetingListProps {
  upcomingMeetings: Meeting[];
  recentMeetings: Meeting[];
  onMeetingAction: (meeting: Meeting) => void;
}

export default function MeetingList({ upcomingMeetings, recentMeetings, onMeetingAction }: MeetingListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recent'>('upcoming');

  const meetings = activeTab === 'upcoming' ? upcomingMeetings : recentMeetings;

  return (
    <div className="w-full">
      <div className="flex space-x-1 bg-gray-100 dark:bg-[#10101C] p-1 rounded-xl mb-6 w-full max-w-sm border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'recent'
              ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          Recent
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-[#10101C]">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No meetings found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming meetings scheduled."
              : "You haven't had any recent meetings."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} onAction={onMeetingAction} />
          ))}
        </div>
      )}
    </div>
  );
}
