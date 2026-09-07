"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { User } from "@/lib/types";

interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ChatSidebarProps {
  currentUser: User | null;
}

export default function ChatSidebar({ currentUser }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() === "") return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: currentUser?.name || "Me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-800">Meeting Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-800">{msg.senderName}</span>
                <span className="text-[10px] text-gray-500">{msg.time}</span>
              </div>
              <div className="text-sm text-gray-700 bg-white p-2 rounded-lg inline-block self-start max-w-[90%] shadow-sm border border-gray-200">
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-gray-100 border border-transparent focus:bg-white focus:border-zoom-blue focus:ring-1 focus:ring-zoom-blue rounded-full px-4 py-2 outline-none transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="p-2 bg-zoom-blue hover:bg-zoom-blue-dark text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
