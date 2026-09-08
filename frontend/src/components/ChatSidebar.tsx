"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { User, Meeting, ChatMessage } from "@/lib/types";
import { getMeetingChat, sendMeetingChat } from "@/lib/api";

interface ChatSidebarProps {
  currentUser: User | null;
  meeting: Meeting;
}

export default function ChatSidebar({ currentUser, meeting }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chats = await getMeetingChat(meeting.meeting_id);
        setMessages(chats);
      } catch (err) {
        console.error("Failed to fetch chat", err);
      }
    };

    fetchChat();
    const intervalId = setInterval(fetchChat, 3000);
    return () => clearInterval(intervalId);
  }, [meeting.meeting_id]);

  const handleSend = async () => {
    if (inputText.trim() === "") return;
    
    const textToSend = inputText;
    const senderName = currentUser?.name || "Guest";
    setInputText("");
    
    try {
      await sendMeetingChat(meeting.meeting_id, senderName, textToSend);
      // Optimistically fetch immediately to update UI without waiting for next poll
      const chats = await getMeetingChat(meeting.meeting_id);
      setMessages(chats);
    } catch (err) {
      console.error("Failed to send chat", err);
      // If it fails, restore input text
      setInputText(textToSend);
    }
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
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender_name === currentUser?.name ? "items-end" : "items-start"}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-800">{msg.sender_name === currentUser?.name ? "Me" : msg.sender_name}</span>
                <span className="text-[10px] text-gray-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`text-sm text-gray-700 bg-white p-2 rounded-lg inline-block self-start max-w-[90%] shadow-sm border border-gray-200 ${msg.sender_name === currentUser?.name ? "bg-blue-50 border-blue-100 self-end" : ""}`}>
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
