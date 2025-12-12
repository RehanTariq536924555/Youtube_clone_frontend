import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward } from 'lucide-react';
import { cn } from './ui/Utils';

export const VideoPlayer = ({ src, thumbnail }: { src?: string; thumbnail: string }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(30);

  // This is a UI mockup. In a real app, we would use a <video> ref.
  
  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl shadow-black/50 ring-1 ring-white/10">
      <img 
        src={thumbnail} 
        alt="Video Thumbnail" 
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          playing ? "opacity-40" : "opacity-100"
        )}
      />
      
      {/* Play Overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <button 
            onClick={() => setPlaying(true)}
            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-all group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]"
          >
            <Play size={32} fill="currentColor" className="text-white ml-1" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer relative group/progress">
          <div className="absolute inset-0 bg-white/30 rounded-full scale-y-100 group-hover/progress:scale-y-150 transition-transform origin-bottom" />
          <div style={{ width: `${progress}%` }} className="h-full bg-primary relative rounded-full">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 shadow-md transform scale-0 group-hover/progress:scale-100 transition-all" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setPlaying(!playing)} className="hover:text-primary transition-colors">
              {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button className="hover:text-primary transition-colors">
                <SkipForward size={20} fill="currentColor" />
            </button>
            <div className="flex items-center gap-2 group/vol">
               <button onClick={() => setMuted(!muted)} className="hover:text-primary transition-colors">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
               </button>
               <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                    <div className="h-1 bg-white/30 w-16 ml-2 rounded-full">
                        <div className="w-1/2 h-full bg-white rounded-full" />
                    </div>
               </div>
            </div>
            <span className="text-xs font-medium text-zinc-300">4:20 / 12:45</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
             <button className="hover:text-primary transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
