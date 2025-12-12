import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { LayoutDashboard, Video, MessageSquare, DollarSign, Settings, Edit, Trash2, ExternalLink, Eye, ThumbsUp, Heart, Shield, CreditCard, Bell, Camera, Image as ImageIcon, Save, Loader2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type StudioTab = 'dashboard' | 'content' | 'comments' | 'earn' | 'settings';

// --- Sub-Components for Tabs ---

const DashboardView = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Card */}
            <div className="bg-[#151518] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div>
                    <p className="text-zinc-400 font-medium">Total Subscribers</p>
                    <h3 className="text-3xl font-bold text-white mt-1">1,204,502</h3>
                </div>
                <p className="text-emerald-400 text-sm font-medium">+2.4K in last 28 days</p>
            </div>
            <div className="bg-[#151518] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40">
                <div>
                    <p className="text-zinc-400 font-medium">Views (28d)</p>
                    <h3 className="text-3xl font-bold text-white mt-1">4.5M</h3>
                </div>
                <p className="text-emerald-400 text-sm font-medium">+12% vs previous period</p>
            </div>
            <div className="bg-[#151518] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40">
                <div>
                    <p className="text-zinc-400 font-medium">Estimated Revenue</p>
                    <h3 className="text-3xl font-bold text-white mt-1">$12,450.00</h3>
                </div>
                <p className="text-emerald-400 text-sm font-medium">Processing...</p>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-[#151518] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Analytics Overview</h3>
                <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-sm outline-none">
                    <option>Last 7 days</option>
                    <option>Last 28 days</option>
                    <option>Last 90 days</option>
                </select>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[]}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px'}}
                            itemStyle={{color: '#fff'}}
                        />
                        <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const ContentView = () => (
    <div className="bg-[#151518] border border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-500">
        <div className="p-4 border-b border-white/5 flex gap-4">
            <input type="text" placeholder="Filter videos..." className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-64 outline-none focus:border-primary transition-colors" />
            <div className="flex-1" />
            <Button variant="ghost" size="sm">Filter</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-white/5">
                    <tr className="text-zinc-400 text-sm">
                        <th className="p-4 font-medium w-[40%]">Video</th>
                        <th className="p-4 font-medium">Visibility</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Views</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                            <Video size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No videos uploaded yet</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const CommentsView = () => (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 max-w-4xl">
        <div className="bg-[#151518] border border-white/5 rounded-xl p-8 text-center text-zinc-500">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
        </div>
    </div>
);

const EarnView = () => (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
                <DollarSign size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Channel Monetization</h2>
            <p className="text-zinc-400">Manage your revenue sources and payout settings.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#151518] border border-white/5 p-6 rounded-2xl">
                 <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard size={20} /> Membership</h3>
                 <p className="text-sm text-zinc-400 mb-6">Offer exclusive perks to your subscribers for a monthly fee.</p>
                 <Button variant="outline" className="w-full">Manage Memberships</Button>
            </div>
             <div className="bg-[#151518] border border-white/5 p-6 rounded-2xl">
                 <h3 className="font-semibold mb-4 flex items-center gap-2"><DollarSign size={20} /> Ad Revenue</h3>
                 <p className="text-sm text-zinc-400 mb-6">You are currently earning from video ads and premium views.</p>
                 <Button variant="outline" className="w-full">Ad Settings</Button>
            </div>
        </div>
    </div>
);

const SettingsView = () => {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // Local state for the form
    const [name, setName] = useState(user?.name || '');
    const [handle, setHandle] = useState(user?.handle || '');
    const [description, setDescription] = useState(user?.description || '');
    
    // File states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    // Computed previews
    const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : (user?.avatar || 'https://ui-avatars.com/api/?background=random');
    const bannerPreview = bannerFile ? URL.createObjectURL(bannerFile) : user?.banner;

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (user) {
                const newAvatarUrl = avatarFile ? URL.createObjectURL(avatarFile) : user.avatar;
                const newBannerUrl = bannerFile ? URL.createObjectURL(bannerFile) : user.banner;

                updateUser({
                    ...user,
                    name,
                    handle,
                    description,
                    avatar: newAvatarUrl || '',
                    banner: newBannerUrl
                });
            }
            setIsLoading(false);
            setAvatarFile(null); // Clear pending files
            setBannerFile(null);
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold">Channel Customization</h2>
                    <p className="text-zinc-400 text-sm mt-1">Manage your channel's branding and basic info.</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Branding Section */}
                <section className="bg-[#151518] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><ImageIcon size={18} /> Branding</h3>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full border-4 border-zinc-800 overflow-hidden relative group">
                                <img src={avatarPreview} className="w-full h-full object-cover" alt="Profile" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="text-white" size={24} />
                                </div>
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, setAvatarFile)}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Profile Picture</p>
                                <p className="text-xs text-zinc-500 mt-1">PNG or GIF, min 98x98px</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full relative overflow-hidden">
                                Change
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, setAvatarFile)}
                                />
                            </Button>
                        </div>

                        {/* Banner */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="w-full h-32 bg-zinc-800 rounded-xl overflow-hidden relative group border border-zinc-700">
                                {bannerPreview ? (
                                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">No Banner Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-white font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        <Camera size={16} /> Change Banner
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e, setBannerFile)}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Banner Image</p>
                                <p className="text-xs text-zinc-500 mt-1">For best results on all devices, use an image that's at least 2048 x 1152 pixels and 6MB or less.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Basic Info Section */}
                <section className="bg-[#151518] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><User size={18} /> Basic Info</h3>
                    
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input 
                                label="Channel Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter channel name"
                            />
                            <Input 
                                label="Handle" 
                                value={handle} 
                                onChange={(e) => setHandle(e.target.value)}
                                icon={<span className="text-zinc-500 text-sm">@</span>}
                                placeholder="user123"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
                            <textarea 
                                rows={5}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell viewers about your channel..."
                            />
                             <p className="text-xs text-zinc-500 mt-2 text-right">{description.length} / 1000</p>
                        </div>
                    </div>
                </section>
                
                {/* Save Bar */}
                <div className="sticky bottom-0 bg-[#0d0d0f]/80 backdrop-blur-md border-t border-white/5 p-4 -mx-8 -mb-8 flex justify-end gap-3 rounded-b-xl z-10">
                    <Button variant="ghost">Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Main Studio Component ---

export const Studio = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');

  const SidebarItem = ({ tab, icon: Icon, label }: { tab: StudioTab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === tab 
            ? 'bg-primary/10 text-primary' 
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
        }`}
    >
        <Icon size={20} />
        {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0d0d0f] overflow-hidden">
        {/* Studio Sidebar */}
        <div className="w-64 border-r border-white/5 flex flex-col bg-[#0d0d0f] shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                    <Video size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Studio</span>
            </div>

            <div className="px-3 flex flex-col gap-1 flex-1 overflow-y-auto">
                <SidebarItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
                <SidebarItem tab="content" icon={Video} label="Content" />
                <SidebarItem tab="comments" icon={MessageSquare} label="Comments" />
                <SidebarItem tab="earn" icon={DollarSign} label="Earn" />
                <SidebarItem tab="settings" icon={Settings} label="Settings" />
            </div>
            
            <div className="p-4 border-t border-white/5">
                <Link to="/">
                    <Button variant="secondary" className="w-full gap-2">
                        <ExternalLink size={16} /> Back to Nebula
                    </Button>
                </Link>
            </div>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
            
            {/* HEADER - Only show if NOT in settings (Settings has its own header) */}
            {activeTab !== 'settings' && (
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
                    <div className="flex gap-3">
                        <Button variant="outline">Manage</Button>
                        <Link to="/upload"><Button>Create New</Button></Link>
                    </div>
                </div>
            )}

            {/* Render Active Tab Content */}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'content' && <ContentView />}
            {activeTab === 'comments' && <CommentsView />}
            {activeTab === 'earn' && <EarnView />}
            {activeTab === 'settings' && <SettingsView />}
            
        </div>
    </div>
  );
};