"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Download, Check, X, Minus, Clock } from "lucide-react";

type PresenceState = "available" | "away" | "dnd" | "busy";

export default function TopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [presence, setPresence] = useState<PresenceState>("available");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const StatusIndicatorIcon = ({ state, className }: { state: PresenceState, className?: string }) => {
    switch(state) {
      case "available": return <div className={`rounded-full bg-green-500 ${className}`}></div>;
      case "busy": return <div className={`rounded-full bg-red-500 flex items-center justify-center ${className}`}><X className="w-2 h-2 text-white stroke-[3]" /></div>;
      case "dnd": return <div className={`rounded-full bg-red-500 flex items-center justify-center ${className}`}><Minus className="w-2 h-2 text-white stroke-[3]" /></div>;
      case "away": return <div className={`rounded-full bg-gray-400 flex items-center justify-center ${className}`}><Clock className="w-2 h-2 text-white stroke-[3]" /></div>;
    }
  };

  return (
    <div className="h-14 bg-[#F3F4F6] border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
      <div className="w-48 flex items-center">
        <span className="text-[17px] font-semibold text-gray-800 tracking-tight leading-tight">
          zoom<br/><span className="text-[13px] font-normal text-gray-500 tracking-normal">Workplace</span>
        </span>
      </div>

      <div className="flex-1 max-w-lg mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-white border border-gray-300 rounded-full py-1.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B5CFF] transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 rounded border border-gray-200">
            Ctrl+K
          </div>
        </div>
      </div>

      <div className="w-48 flex items-center justify-end gap-4">
        <button className="bg-[#094AC2] hover:bg-blue-800 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
          Upgrade
        </button>
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#094AC2] font-bold text-sm cursor-pointer transition-all ${isProfileOpen ? 'ring-2 ring-[#0B5CFF] ring-offset-2 ring-offset-[#F3F4F6]' : 'border border-blue-200 hover:border-blue-300'}`}
          >
            MB
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#F3F4F6] z-10 flex items-center justify-center overflow-hidden">
            <StatusIndicatorIcon state={presence} className="w-full h-full" />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-3 w-[280px] bg-white rounded-md shadow-[0_4px_24px_rgba(0,0,0,0.15)] z-50 text-sm overflow-hidden flex flex-col border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* User Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="font-bold text-gray-900 text-base">Mrigank Bhatnagar</div>
                <div className="text-sm text-gray-500 mt-0.5">mrigank@example.com</div>
              </div>

              {/* Presence State Section */}
              <div className="py-2 border-b border-gray-200">
                <div 
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => setPresence("available")}
                >
                  <div className="w-4 flex justify-center">{presence === "available" && <Check className="w-4 h-4 text-[#0B5CFF]" />}</div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-green-600/20"></div>
                  <span className="text-gray-800 font-medium">Available</span>
                </div>
                <div 
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => setPresence("away")}
                >
                  <div className="w-4 flex justify-center">{presence === "away" && <Check className="w-4 h-4 text-[#0B5CFF]" />}</div>
                  <div className="w-3.5 h-3.5 rounded-full bg-gray-400 flex items-center justify-center"><Clock className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                  <span className="text-gray-800 font-medium">Away</span>
                </div>
                <div 
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => setPresence("dnd")}
                >
                  <div className="w-4 flex justify-center">{presence === "dnd" && <Check className="w-4 h-4 text-[#0B5CFF]" />}</div>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center"><Minus className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                  <span className="text-gray-800 font-medium">Do not disturb</span>
                </div>
                <div 
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => setPresence("busy")}
                >
                  <div className="w-4 flex justify-center">{presence === "busy" && <Check className="w-4 h-4 text-[#0B5CFF]" />}</div>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center"><X className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                  <span className="text-gray-800 font-medium">Busy</span>
                </div>
              </div>

              {/* Standard List Items */}
              <div className="py-2 border-b border-gray-200">
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-800 font-medium transition-colors">
                  Profile
                </div>
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex justify-between items-center text-gray-800 font-medium transition-colors">
                  <span>Language</span>
                  <span className="text-gray-500 font-normal">English</span>
                </div>
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-800 font-medium transition-colors">
                  Check for Updates
                </div>
              </div>

              <div className="py-2 border-b border-gray-200">
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-800 font-medium transition-colors">
                  Settings
                </div>
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-800 font-medium transition-colors">
                  Sign Out
                </div>
              </div>

              {/* Call to Action */}
              <div className="py-2">
                <div className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-[#0B5CFF] font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download the Zoom app</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
