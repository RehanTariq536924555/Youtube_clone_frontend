import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Bell, Search, ListVideo, MessageSquare, Info, Flag } from 'lucide-react';

// --- Sub-Components for Tabs ---

const HomeTab = ({ channel, videos, shorts }: { channel: any, videos: any[], shorts: any[] }) => (
    <div className="animate-in fade-in duration-300">
        {videos.length > 0 && (
            <div className="mb-8">
                <div className="relative w-full aspect-video md:aspect-[3/1] lg:aspect-[4/1] rounded-2xl overflow-hidden mb-8 group">
                     <img src={videos[0].thumbnail} className="w-full h-full object-cover" alt="Featured" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">Featured</span>
                        <h2 className="text-xl md:text-3xl font-bold mb-2">{videos[0].title}</h2>
                        <p className="text-zinc-300 max-w-2xl line-clamp-2">{videos[0].description}</p>
                     </div>
                </div>
            </div>
        )}

        <div className="mb-10">
            <h3 className="font-bold text-lg mb-4">Latest Videos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.slice(0, 4).map(v => <VideoCard key={v.id} video={{...v, channelName: channel.name, channelAvatar: channel.avatar}} />)}
            </div>
        </div>

        <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><span className="text-primary">Shorts</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shorts.slice(0, 6).map(s => (
                    <div key={s.id} className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer hover:scale-[1.02] transition-transform">
                        <img src={`https://picsum.photos/seed/${s.id}/300/500`} className="w-full h-full object-cover" alt={s.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                            <p className="font-bold text-white text-sm line-clamp-2">{s.title}</p>
                            <p className="text-xs text-zinc-300 mt-1">{s.views} views</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const VideosTab = ({ videos }: { videos: any[] }) => (
    <div className="animate-in fade-in duration-300">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
             <Button size="sm" variant="secondary" className="bg-white text-black">Latest</Button>
             <Button size="sm" variant="secondary">Popular</Button>
             <Button size="sm" variant="secondary">Oldest</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map(v => <VideoCard key={v.id} video={v} />)}
            {/* Duplicates to fill the grid for demo */}
            {videos.map(v => <VideoCard key={v.id+'dup'} video={{...v, id: v.id+'d'}} />)}
            {videos.map(v => <VideoCard key={v.id+'dup2'} video={{...v, id: v.id+'d2'}} />)}
        </div>
    </div>
);

const ShortsTab = ({ shorts }: { shorts: any[] }) => (
    <div className="animate-in fade-in duration-300">
         <h3 className="font-bold text-xl mb-6">All Shorts</h3>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...shorts, ...shorts, ...shorts].map((s, i) => (
                <div key={`${s.id}-${i}`} className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer bg-zinc-900 hover:ring-2 hover:ring-primary transition-all">
                    <img src={`https://picsum.photos/seed/${s.id}${i}/300/500`} className="w-full h-full object-cover" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                        <p className="font-bold text-white text-sm line-clamp-2">{s.title}</p>
                        <p className="text-xs text-zinc-300 mt-1">{s.views} views</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PlaylistsTab = () => {
    const PLAYLISTS = [
        { id: 1, title: "Coding Tutorials", count: 12, thumb: "https://picsum.photos/seed/pl1/640/360" },
        { id: 2, title: "Vlogs 2023", count: 45, thumb: "https://picsum.photos/seed/pl2/640/360" },
        { id: 3, title: "Music Mixes", count: 8, thumb: "https://picsum.photos/seed/pl3/640/360" },
        { id: 4, title: "Tech Reviews", count: 156, thumb: "https://picsum.photos/seed/pl4/640/360" },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {PLAYLISTS.map(p => (
                <div key={p.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-800">
                        <img src={p.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.title} />
                        <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                             <span className="font-bold text-xl">{p.count}</span>
                             <ListVideo size={20} className="mt-1" />
                        </div>
                    </div>
                    <h3 className="font-bold text-zinc-100 group-hover:text-white">{p.title}</h3>
                    <p className="text-sm text-zinc-500">View full playlist</p>
                </div>
            ))}
        </div>
    );
};

const CommunityTab = ({ channel }: { channel: any }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
             <div className="bg-[#151518] border border-white/5 rounded-xl p-4 md:p-6">
                 <div className="flex items-start gap-4">
                     <img src={channel.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
                     <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="font-semibold text-sm">{channel.name}</span>
                             <span className="text-xs text-zinc-500">1 day ago</span>
                         </div>
                         <p className="text-zinc-200 mb-4">Just dropped a new video about the future of AI in web development! Let me know what you think in the comments. 🚀</p>
                         <div className="aspect-video rounded-lg overflow-hidden border border-white/10 mb-4">
                             <img src="https://picsum.photos/seed/post1/800/450" className="w-full h-full object-cover" alt="Post" />
                         </div>
                         <div className="flex items-center gap-6 text-zinc-400">
                             <button className="flex items-center gap-2 hover:text-white"><div className="p-2 rounded-full hover:bg-zinc-800"><MessageSquare size={20} /></div> 24</button>
                             <button className="flex items-center gap-2 hover:text-white"><div className="p-2 rounded-full hover:bg-zinc-800"><span className="text-lg">👍</span></div> 1.2K</button>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="bg-[#151518] border border-white/5 rounded-xl p-4 md:p-6">
                 <div className="flex items-start gap-4">
                     <img src={channel.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
                     <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="font-semibold text-sm">{channel.name}</span>
                             <span className="text-xs text-zinc-500">3 days ago</span>
                         </div>
                         <p className="text-zinc-200 mb-2">Poll: What should the next tutorial be about?</p>
                         <div className="space-y-2 mt-3">
                             <div className="p-3 border border-zinc-700 rounded hover:bg-zinc-800 cursor-pointer text-sm">React Server Components (60%)</div>
                             <div className="p-3 border border-zinc-700 rounded hover:bg-zinc-800 cursor-pointer text-sm">Next.js 14 Animations (30%)</div>
                             <div className="p-3 border border-zinc-700 rounded hover:bg-zinc-800 cursor-pointer text-sm">TypeScript Advanced Types (10%)</div>
                         </div>
                         <div className="flex items-center gap-6 text-zinc-400 mt-4">
                             <span className="text-xs">2.5K votes</span>
                             <button className="flex items-center gap-2 hover:text-white"><div className="p-2 rounded-full hover:bg-zinc-800"><span className="text-lg">👍</span></div> 450</button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

const AboutTab = ({ channel }: { channel: any }) => (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
        <div className="flex-1 space-y-6">
            <div className="bg-[#151518] border border-white/5 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Description</h3>
                <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                    {channel.description || "Welcome to my channel! I create content about technology, coding, and digital creativity.\n\nNew videos every Tuesday and Friday.\n\nFor business inquiries: contact@nebulastream.com"}
                    {'\n\n'}
                    Specs:
                    - Camera: Sony A7III
                    - Lens: 24-70mm GM
                    - Mic: Shure SM7B
                </p>
            </div>
        </div>
        <div className="w-full md:w-80 shrink-0 space-y-6">
            <div className="bg-[#151518] border border-white/5 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg border-b border-white/10 pb-2">Stats</h3>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Joined</span>
                    <span>Sep 12, 2018</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Views</span>
                    <span>14,203,492</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Location</span>
                    <span>United States</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-center">
                     <button className="text-primary text-sm font-medium flex items-center gap-2"><Flag size={16} /> Report User</button>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Channel Component ---

export const Channel = () => {
  const { id } = useParams();

  return (
    <div className="pb-10 overflow-y-auto h-full">
      <div className="px-4 md:px-12 pt-6 pb-4 max-w-[1800px] mx-auto">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Channel Page</h1>
          <p className="text-zinc-400 mb-6">
            Channel functionality is being updated to use real backend data.
          </p>
          <p className="text-zinc-500 text-sm">
            Channel ID: {id}
          </p>
        </div>
      </div>
    </div>
  );
};