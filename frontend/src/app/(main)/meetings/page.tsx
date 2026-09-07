"use client";

import { RefreshCw, Calendar, Copy, Edit3, Eye } from "lucide-react";
import { createInstantMeeting } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MeetingsView() {
  const router = useRouter();
  const pmi = "703 768 6404";

  const handleStart = async () => {
    try {
      const { meeting_id } = await createInstantMeeting();
      router.push(`/meeting/${meeting_id}`);
    } catch (e) {}
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Secondary Sidebar (List) */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full shrink-0">
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
          <span className="font-semibold text-gray-800">Upcoming</span>
          <button className="text-gray-500 hover:text-gray-700">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
          {/* Active PMI Card */}
          <div className="bg-zoom-blue text-white rounded-lg p-4 shadow-sm cursor-pointer relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>
            <h3 className="font-medium text-sm mb-1">My Personal Meeting ID (PMI)</h3>
            <p className="text-xl font-light tracking-wider opacity-90">{pmi}</p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center opacity-60">
            <Calendar className="w-10 h-10 text-gray-400 mb-3 stroke-[1.5]" />
            <p className="text-sm text-gray-500">No upcoming meetings</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
            <Calendar className="w-4 h-4" />
            + Add a calendar
          </button>
        </div>
      </div>

      {/* Main Content Area (Details) */}
      <div className="flex-1 bg-white flex flex-col pt-16 px-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Personal Meeting ID (PMI)</h1>
        <p className="text-4xl font-light text-gray-800 mb-8 tracking-wide">{pmi}</p>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleStart} className="bg-zoom-blue hover:bg-zoom-blue-dark text-white px-8 py-2 rounded-lg font-medium shadow-sm transition-colors">
            Start
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Copy className="w-4 h-4 text-gray-500" />
            Copy Invitation
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Edit3 className="w-4 h-4 text-gray-500" />
            Edit
          </button>
        </div>

        <button className="text-zoom-blue hover:underline text-sm font-medium self-start flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          Show Meeting Invitation
        </button>
      </div>
    </div>
  );
}
