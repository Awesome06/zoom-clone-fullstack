"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Plus, Calendar, Info, RefreshCw } from "lucide-react";
import { createInstantMeeting } from "@/lib/api";
import ScheduleModal from "@/components/ScheduleModal";

export default function HomeView() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  const [isScheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewMeeting = async () => {
    try {
      const { meeting_id } = await createInstantMeeting();
      router.push(`/meeting/${meeting_id}`);
    } catch (err) {
      // Handle silently
    }
  };



  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-6xl font-light text-gray-900 mb-2 tracking-tight">{currentTime || '\u00A0'}</h2>
        <p className="text-lg text-gray-500 font-medium">{currentDate || '\u00A0'}</p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-10 mb-8">
        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleNewMeeting}>
          <div className="w-[72px] h-[72px] bg-zoom-orange hover:bg-[#D95F1A] text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all relative">
            <Video className="w-8 h-8" />
            {/* Split button chevron simulation */}
            <div className="absolute right-1 bottom-1 w-4 h-4 bg-black/10 rounded flex items-center justify-center">
              <ChevronDown className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-[13px] font-medium text-gray-700">New meeting</span>
        </div>

        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => router.push('/join')}>
          <div className="w-[72px] h-[72px] bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-[13px] font-medium text-gray-700">Join</span>
        </div>

        <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setScheduleOpen(true)}>
          <div className="w-[72px] h-[72px] bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-[20px] shadow-sm flex items-center justify-center transition-all">
            <Calendar className="w-7 h-7 mb-0.5" />
          </div>
          <span className="text-[13px] font-medium text-gray-700">Schedule</span>
        </div>
      </div>

      {/* Calendar Banner */}
      <div className="w-full max-w-3xl mb-8 bg-[#F0F6FF] border border-[#BCE1FC] rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-zoom-blue shrink-0 mt-0.5" />
        <p className="text-[13px] text-gray-700 leading-snug">
          You haven&apos;t connected your calendar yet. <button className="text-zoom-blue hover:underline">Connect now</button> to manage all your meetings and events in one place.
        </p>
      </div>

      {/* Upcoming Meetings Panel */}
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[280px]">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            Today, Sep 8
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
             {/* Beach umbrella basic representation */}
             <ellipse cx="60" cy="75" rx="30" ry="10" fill="#F0F0F0" />
             <path d="M40 30 C 40 10, 80 10, 80 30 Z" fill="#D3E2F4" />
             <path d="M60 10 L 60 70" stroke="#B0C4DE" strokeWidth="2" />
             <path d="M50 70 L 70 70" stroke="#B0C4DE" strokeWidth="2" />
          </svg>
          <span className="text-[13px] text-gray-500 font-medium">No meetings scheduled.</span>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center">
          <button className="text-[13px] text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
            Open recordings
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>



      <ScheduleModal 
        isOpen={isScheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={() => {}}
      />
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  );
}
