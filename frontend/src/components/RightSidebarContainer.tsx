"use client";

import { ReactNode } from "react";

interface RightSidebarContainerProps {
  showParticipants: boolean;
  showChat: boolean;
  participantsComponent: ReactNode;
  chatComponent: ReactNode;
}

export default function RightSidebarContainer({
  showParticipants,
  showChat,
  participantsComponent,
  chatComponent,
}: RightSidebarContainerProps) {
  if (!showParticipants && !showChat) {
    return null;
  }

  const bothOpen = showParticipants && showChat;

  return (
    <div className="w-80 flex flex-col h-[calc(100vh-5rem)] bg-white border-l border-gray-200 shrink-0">
      {showParticipants && (
        <div className={`flex flex-col border-b border-gray-200 ${bothOpen ? 'flex-1 h-1/2' : 'h-full'}`}>
          <div className="h-full overflow-hidden flex flex-col">
            {participantsComponent}
          </div>
        </div>
      )}
      
      {showChat && (
        <div className={`flex flex-col ${bothOpen ? 'flex-1 h-1/2' : 'h-full'}`}>
          <div className="h-full overflow-hidden flex flex-col">
            {chatComponent}
          </div>
        </div>
      )}
    </div>
  );
}
