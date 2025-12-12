import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Loader2, Camera, User, LayoutTemplate } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface CreateChannelProps {
  onChannelCreated: () => void;
}

export const CreateChannel: React.FC<CreateChannelProps> = ({ onChannelCreated }) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Preview URLs
  const avatarPreview = avatar ? URL.createObjectURL(avatar) : null;
  const bannerPreview = banner ? URL.createObjectURL(banner) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // In a real app, user ID comes from the verified token/session
        const result = await authService.createChannel({
            userId: 'new_user_id', 
            name: name,
            handle: '@' + handle.replace(/\s+/g, '').toLowerCase().replace('@', ''),
            description,
            avatar,
            banner
        });

        // Log the user in with the newly created profile
        login(result.user, 'new-session-token');
        onChannelCreated();
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
      if (e.target.files && e.target.files[0]) {
          setter(e.target.files[0]);
      }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">How you'll appear</h1>
        <p className="text-zinc-400 mt-2">Create your channel to start uploading</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Branding Preview Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-900 overflow-hidden flex items-center justify-center relative shadow-xl">
                        {avatarPreview ? (
                            <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar Preview" />
                        ) : (
                            <User size={48} className="text-zinc-600" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Camera className="text-white" size={24} />
                        </div>
                        {/* INPUT MUST BE Z-INDEXED HIGH TO CATCH CLICKS */}
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                            accept="image/*" 
                            title="Upload profile picture"
                            onChange={(e) => handleFileChange(e, setAvatar)} 
                        />
                    </div>
                    <p className="text-xs text-zinc-500 text-center mt-2 group-hover:text-primary transition-colors">Upload Picture</p>
                </div>
            </div>

            <div className="space-y-5">
                 <Input 
                    label="Channel Name" 
                    placeholder="e.g. Nebula Gaming"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input 
                    label="Handle" 
                    placeholder="myawesomechannel"
                    icon={<span className="text-zinc-500 font-bold">@</span>}
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    className="lowercase"
                />
                
                <div>
                     <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
                     <textarea 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-sm"
                        rows={3}
                        placeholder="Tell viewers about your content..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                     />
                </div>

                 {/* Banner Upload Mini UI */}
                 <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Banner Image</label>
                    <div className="relative h-24 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl overflow-hidden group hover:border-zinc-500 transition-colors">
                        {bannerPreview && <img src={bannerPreview} className="w-full h-full object-cover opacity-60" alt="Banner" />}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-200">
                                <LayoutTemplate size={18} />
                                <span className="text-sm font-medium">Upload Banner</span>
                            </div>
                        </div>
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
                            accept="image/*" 
                            title="Upload channel banner"
                            onChange={(e) => handleFileChange(e, setBanner)} 
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-2">
                 <Button type="button" variant="ghost" className="flex-1" onClick={onChannelCreated}>Skip for now</Button>
                 <Button type="submit" className="flex-[2]" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Channel'}
                </Button>
            </div>
        </form>
    </div>
  );
};