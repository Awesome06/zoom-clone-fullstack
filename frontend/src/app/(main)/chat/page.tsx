"use client";

import { ChevronDown, Settings, Plus, Star, Share2, PlusCircle, Hash } from "lucide-react";

export default function ChatView() {
  return (
    <div className="flex h-full w-full bg-white">
      {/* Secondary Sidebar */}
      <div className="w-[320px] border-r border-gray-200 bg-[#F8F9FA] flex flex-col h-full shrink-0">
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
          <button className="flex items-center gap-1.5 font-bold text-lg text-gray-900">
            Chat <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><Settings className="w-4 h-4" /></button>
            <button className="p-1.5 bg-zoom-blue hover:bg-zoom-blue-dark rounded-md text-white shadow-sm"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="px-3 py-2 bg-white border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-200">All</span>
          <span className="px-3 py-1 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-100">@ Mentions</span>
          <span className="px-3 py-1 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-100">Unread</span>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <AccordionItem title="Apps" icon={<LayoutGrid className="w-4 h-4" />} />
          <AccordionItem title="Chats & Channels" icon={<Hash className="w-4 h-4" />} defaultOpen />
          <AccordionItem title="Starred" icon={<Star className="w-4 h-4" />} />
          <AccordionItem title="Shared spaces" icon={<Share2 className="w-4 h-4" />} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center">
        <div className="max-w-md w-full flex flex-col items-center text-center">
          <svg width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 opacity-80">
            <rect x="40" y="20" width="80" height="60" rx="16" fill="#D3E2F4" />
            <path d="M60 80 L50 100 L70 80 Z" fill="#D3E2F4" />
            <rect x="80" y="50" width="80" height="60" rx="16" fill="#0E72ED" />
            <path d="M140 110 L150 130 L130 110 Z" fill="#0E72ED" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to Team Chat</h3>
          <p className="text-gray-500 text-[15px] max-w-sm">
            Start chatting by clicking <span className="font-semibold text-gray-700">+</span> or creating a chat in the left sidebar.
          </p>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({ title, icon, defaultOpen = false }: { title: string, icon: React.ReactNode, defaultOpen?: boolean }) {
  return (
    <div className="mb-1">
      <button className="w-full px-4 py-1.5 flex items-center justify-between hover:bg-gray-100 text-gray-600 group">
        <div className="flex items-center gap-2">
          {defaultOpen ? <ChevronDown className="w-3 h-3 opacity-50" /> : <ChevronRight className="w-3 h-3 opacity-50" />}
          {icon}
          <span className="text-xs font-semibold">{title}</span>
        </div>
        <PlusCircle className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700" />
      </button>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
function LayoutGrid({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
}
