import React, { useState } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { useChannel } from '../context/ChannelContext';
import { useNavigate } from 'react-router-dom';

export const ChannelSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { channels, activeChannel, setActiveChannel, isLoading } = useChannel();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg animate-pulse">
        <div className="w-8 h-8 bg-zinc-800 rounded-full" />
        <div className="w-24 h-4 bg-zinc-800 rounded" />
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <button
        onClick={() => navigate('/my-channels')}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-sm"
      >
        <Plus size={16} />
        <span>Create Channel</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors min-w-[200px]"
      >
        {activeChannel ? (
          <>
            {activeChannel.avatar ? (
              <img
                src={activeChannel.avatar}
                alt={activeChannel.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {activeChannel.name[0]}
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white truncate">
                {activeChannel.name}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                @{activeChannel.handle}
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
            <span className="text-sm text-zinc-400">Select Channel</span>
            <ChevronDown size={16} className="text-zinc-400" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800">
              <p className="text-xs text-zinc-400 font-medium">YOUR CHANNELS</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChannel(channel);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors text-left"
                >
                  {channel.avatar ? (
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {channel.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {channel.name}
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      @{channel.handle} • {channel.subscribersCount} subscribers
                    </div>
                  </div>
                  {activeChannel?.id === channel.id && (
                    <Check size={18} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-zinc-800">
              <button
                onClick={() => {
                  navigate('/my-channels');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors text-left text-primary"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <span className="text-sm font-medium">Create a new channel</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
