"use client";

import { Home, Video, MessageSquare, MoreHorizontal, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MorePopover from "./MorePopover";

export default function LeftSidebar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Meetings", href: "/meetings", icon: Video },
    { label: "Chat", href: "/chat", icon: MessageSquare },
  ];

  return (
    <div className="w-[72px] bg-[#F3F4F6] border-r border-gray-200 h-full flex flex-col justify-between py-2 shrink-0 z-10 relative">
      <div className="flex flex-col gap-1 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-3 gap-1 relative group cursor-pointer ${
                isActive ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0B5CFF] rounded-r-md"></div>
              )}
              <item.icon className={`w-6 h-6 ${isActive ? "text-[#0B5CFF]" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#0B5CFF]" : "text-gray-500 group-hover:text-gray-700"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        <div 
          className="flex flex-col items-center justify-center w-full py-3 gap-1 relative group cursor-pointer hover:bg-gray-50"
          onMouseEnter={() => setIsMoreOpen(true)}
          onMouseLeave={() => setIsMoreOpen(false)}
        >
          <MoreHorizontal className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
          <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-700">More</span>
          
          {isMoreOpen && <MorePopover />}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full py-3 group cursor-pointer hover:bg-gray-50">
        <Settings className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
      </div>
    </div>
  );
}
