"use client";

import { Mic, MicOff, Video, VideoOff, Users, MessageSquare, Share, PhoneOff, ChevronUp, Shield, MonitorUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface MeetingToolbarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSidebar: (panel: 'participants' | 'chat') => void;
  onShareScreen: (stream: MediaStream | null) => void;
  onLeave: () => void;
  onEndForAll?: () => void;
  isHost: boolean;
}

export default function MeetingToolbar({ 
  isMuted, 
  isVideoOn, 
  onToggleMute, 
  onToggleVideo, 
  onToggleSidebar, 
  onShareScreen,
  onLeave,
  onEndForAll,
  isHost
}: MeetingToolbarProps) {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [showMicMenu, setShowMicMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  const [showEndMenu, setShowEndMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const endMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (endMenuRef.current && !endMenuRef.current.contains(event.target as Node)) {
        setShowEndMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioInputDevices(devices.filter(d => d.kind === 'audioinput'));
        setAudioOutputDevices(devices.filter(d => d.kind === 'audiooutput'));
        setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };
    getDevices();
  }, []);

  const handleShareScreen = async () => {
    try {
      if (!isSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          selfBrowserSurface: "exclude" 
        } as any);
        setIsSharing(true);
        onShareScreen(stream);
        // In a real app, you would add this stream to the WebRTC connection
        stream.getVideoTracks()[0].onended = () => {
          setIsSharing(false);
          onShareScreen(null);
        };
      } else {
        setIsSharing(false);
        onShareScreen(null);
        // Mock ending the share
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  return (
    <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">
          <button 
            onClick={onToggleMute}
            className={`flex flex-col items-center justify-center w-12 h-14 ${isMuted ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-300'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
            <span className="text-xs font-medium">{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button onClick={() => setShowMicMenu(!showMicMenu)} className="h-14 px-1 text-gray-400 hover:text-white flex items-center justify-center">
            <ChevronUp className="w-4 h-4" />
          </button>
          {showMicMenu && (
            <div className="absolute bottom-16 left-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 text-sm text-gray-200 z-50">
              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select a Microphone</div>
              {audioInputDevices.map(d => (
                <button key={d.deviceId} className="w-full text-left px-4 py-2 hover:bg-zoom-blue transition-colors truncate">
                  {d.label || `Microphone ${d.deviceId.substring(0,5)}`}
                </button>
              ))}
              <div className="border-t border-gray-700 my-1"></div>
              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select a Speaker</div>
              {audioOutputDevices.map(d => (
                <button key={d.deviceId} className="w-full text-left px-4 py-2 hover:bg-zoom-blue transition-colors truncate">
                  {d.label || `Speaker ${d.deviceId.substring(0,5)}`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex items-center bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">
          <button 
            onClick={onToggleVideo}
            className={`flex flex-col items-center justify-center w-12 h-14 ${!isVideoOn ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-300'}`}
          >
            {!isVideoOn ? <VideoOff className="w-5 h-5 mb-1" /> : <Video className="w-5 h-5 mb-1" />}
            <span className="text-xs font-medium">{!isVideoOn ? "Start Video" : "Stop Video"}</span>
          </button>
          <button onClick={() => setShowVideoMenu(!showVideoMenu)} className="h-14 px-1 text-gray-400 hover:text-white flex items-center justify-center">
            <ChevronUp className="w-4 h-4" />
          </button>
          {showVideoMenu && (
            <div className="absolute bottom-16 left-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 text-sm text-gray-200 z-50">
              <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select a Camera</div>
              {videoDevices.map(d => (
                <button key={d.deviceId} className="w-full text-left px-4 py-2 hover:bg-zoom-blue transition-colors truncate">
                  {d.label || `Camera ${d.deviceId.substring(0,5)}`}
                </button>
              ))}
              <div className="border-t border-gray-700 my-1"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-zoom-blue transition-colors">Choose Virtual Background...</button>
              <button className="w-full text-left px-4 py-2 hover:bg-zoom-blue transition-colors">Blur My Background</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 hidden md:flex">
        {isHost && (
          <div className="relative">
            <button 
              onClick={() => setShowSecurityMenu(!showSecurityMenu)}
              className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Security</span>
            </button>
            {showSecurityMenu && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 text-sm text-gray-200 z-50">
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-zoom-blue rounded border-gray-500 bg-gray-900" />
                  Lock Meeting
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-zoom-blue rounded border-gray-500 bg-gray-900" defaultChecked />
                  Enable Waiting Room
                </label>
                <div className="border-t border-gray-700 my-1"></div>
                <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Allow participants to:</div>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-zoom-blue rounded border-gray-500 bg-gray-900" defaultChecked />
                  Share Screen
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-zoom-blue rounded border-gray-500 bg-gray-900" defaultChecked />
                  Chat
                </label>
                <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-zoom-blue rounded border-gray-500 bg-gray-900" defaultChecked />
                  Unmute Themselves
                </label>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={() => onToggleSidebar('participants')}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Participants</span>
        </button>
        <button 
          onClick={() => onToggleSidebar('chat')}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button 
          onClick={handleShareScreen}
          className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${isSharing ? 'text-red-500 hover:bg-red-500/10' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          {isSharing ? <MonitorUp className="w-5 h-5 mb-1" /> : <Share className="w-5 h-5 mb-1" />}
          <span className="text-xs font-medium">{isSharing ? "Stop Share" : "Share Screen"}</span>
        </button>
      </div>

      <div className="flex md:hidden">
         <button 
          onClick={() => onToggleSidebar('participants')}
          className="flex flex-col items-center justify-center w-16 h-14 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Users</span>
        </button>
      </div>

      <div className="relative" ref={endMenuRef}>
        <button 
          onClick={() => isHost ? setShowEndMenu(!showEndMenu) : onLeave()}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          <span className="hidden sm:inline">End</span>
          {isHost && <ChevronUp className="w-4 h-4" />}
        </button>

        {isHost && showEndMenu && (
          <div className="absolute bottom-14 right-0 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 text-sm text-gray-200 z-50">
            <button 
              onClick={onEndForAll} 
              className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-700 font-semibold border-b border-gray-700/50"
            >
              End Meeting for All
            </button>
            <button 
              onClick={onLeave} 
              className="w-full text-left px-4 py-3 hover:bg-gray-700 font-medium"
            >
              Leave Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
