"use client";

import { CalendarDays, LayoutGrid, Brush, FileText, Table, Presentation, MonitorUp, Clapperboard, CheckSquare, FileEdit, Users } from "lucide-react";

export default function MorePopover() {
  const items = [
    { label: "Scheduler", icon: CalendarDays },
    { label: "Hub", icon: LayoutGrid, isNew: true },
    { label: "Canvas", icon: Brush },
    { label: "Paper", icon: FileText },
    { label: "Sheets", icon: Table },
    { label: "Slides", icon: Presentation },
    { label: "Whiteboards", icon: MonitorUp },
    { label: "Clips", icon: Clapperboard },
    { label: "Tasks", icon: CheckSquare },
    { label: "Notes", icon: FileEdit },
    { label: "Contacts", icon: Users },
  ];

  return (
    <div className="absolute left-[72px] top-0 w-[340px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden pointer-events-none select-none z-50 ml-1">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-y-6 gap-x-2">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 relative">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 border border-gray-100">
                <item.icon className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.label}</span>
              {item.isNew && (
                <div className="absolute -top-2 right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  NEW
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Drag to pin or remove from toolbar</span>
        <span className="text-xs text-zoom-blue font-medium">Reset</span>
      </div>
    </div>
  );
}
