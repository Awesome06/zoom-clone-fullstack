"use client";

import { Search } from "lucide-react";

export default function TopNav() {
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
            className="w-full bg-white border border-gray-300 rounded-full py-1.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-zoom-blue transition-all"
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
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-zoom-blue font-bold text-sm cursor-pointer border border-blue-200">
            MB
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#F3F4F6]"></div>
        </div>
      </div>
    </div>
  );
}
