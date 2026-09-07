"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import { User } from "@/lib/types";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#10101C]">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-zoom-blue p-2 rounded-xl group-hover:bg-zoom-blue-dark transition-colors">
          <Video className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Zoom Clone</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            <div className="w-10 h-10 rounded-full bg-zoom-blue flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
      </div>
    </nav>
  );
}
