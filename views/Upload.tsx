import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Image as ImageIcon, FileVideo, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { videoService, UploadVideoData } from '../services/videoService';
import { useChannel } from '../context/ChannelContext';
import { useNavigate } from 'react-router-dom';

export const Upload = () => {
    const { activeChannel, channels, isLoading: channelsLoading } = useChannel();
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [step, setStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<UploadVideoData>({
        title: '',
        description: '',
        visibility: 'public',
        tags: [],
        category: '',
        isShort: false
    });
    const [, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('video/')) {
            alert("Please upload a valid video file.");
            return;
        }
        setUploadedFile(file);
        setVideoData(prev => ({
            ...prev,
            title: file.name.replace(/\.[^/.]+$/, "") || "My Awesome Video #1"
        }));
        setStep(2);
        setUploadProgress(0);
        setUploadError(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!uploadedFile) return;

        // Check if user is logged in
        const token = localStorage.getItem('auth_token');
        console.log('Token check:', token ? 'Token found' : 'No token found');
        console.log('Active channel:', activeChannel ? `${activeChannel.name} (${activeChannel.id})` : 'No channel selected');

        if (!token) {
            setUploadError('You must be logged in to upload videos');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(0);

        try {
            console.log('Starting video upload...');
            console.log('File:', uploadedFile.name, 'Size:', (uploadedFile.size / 1024 / 1024).toFixed(2), 'MB');
            console.log('Channel:', activeChannel ? `${activeChannel.name} (${activeChannel.id})` : 'Uploading to account (no channel)');
            console.log('Video data:', videoData);

            // Add channelId to video data (optional - can be undefined)
            const uploadData = {
                ...videoData,
                channelId: activeChannel?.id  // Optional - undefined if no channel selected
            };

            const result = await videoService.uploadVideoWithProgress(
                uploadedFile,
                uploadData,
                (progress) => {
                    console.log('Upload progress:', progress + '%');
                    setUploadProgress(progress);
                }
            );

            console.log('Upload successful:', result);
            setUploadProgress(100);
            const uploadLocation = activeChannel ? `to ${activeChannel.name}` : 'to your account';
            alert(`Video uploaded successfully ${uploadLocation}! Redirecting to your videos...`);
            
            // Redirect to My Videos page after successful upload
            setTimeout(() => {
                window.location.href = '/#/my-videos';
            }, 1500);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setUploadError(errorMessage);
            console.error('Upload error:', error);
            console.error('Error details:', errorMessage);
            
            // Show more helpful error message
            if (errorMessage.includes('connect')) {
                alert('Cannot connect to server. Please make sure the backend is running on http://localhost:4000');
            } else if (errorMessage.includes('logged in')) {
                alert('Please log in again to upload videos');
            } else {
                alert('Upload failed: ' + errorMessage);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (field: keyof UploadVideoData, value: string | string[] | boolean) => {
        setVideoData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!videoData.tags?.includes(newTag)) {
                setVideoData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setVideoData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const handleThumbnailUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert("Please upload a valid image file for thumbnail.");
            return;
        }

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setVideoData(prev => ({
            ...prev,
            thumbnail: file
        }));
    };

    const triggerThumbnailInput = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleThumbnailUpload(file);
            }
        };
        input.click();
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col min-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h1 className="text-2xl font-bold">{step === 1 ? 'Upload Video' : `Editing: ${uploadedFile?.name || 'Untitled Video'}`}</h1>
                <Button variant="ghost" size="icon" className="text-white hover:text-red-500 hover:bg-zinc-800">
                    <X className="w-6 h-6 text-white" />
                </Button>
            </div>

            {step === 1 ? (
                <div
                    className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-zinc-700 bg-zinc-900/30'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileSelect}
                    />
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-800 rounded-full flex items-center justify-center animate-bounce-slow shadow-xl border-2 border-zinc-600">
                        <div className="flex flex-col items-center text-white">
                            <div className="text-2xl md:text-3xl mb-1">⬆️</div>
                            <div className="text-xs font-medium">UPLOAD</div>
                        </div>
                    </div>
                    <div className="text-center px-4">
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Drag and drop video files to upload</h2>
                        <p className="text-zinc-500 mb-6 text-sm md:text-base">Your videos will be private until you publish them.</p>
                        <Button onClick={triggerFileInput} size="lg" className="px-8">Select Files</Button>
                    </div>
                    <p className="text-xs text-zinc-600 mt-8">Supported formats: MP4, MOV, AVI, WEBM</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col xl:flex-row gap-6 lg:gap-8">
                    {/* Left Side: Form */}
                    <div className="flex-1 pr-2 xl:pr-4">
                        {/* Upload Status Bar */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6 flex items-center gap-4 shadow-sm">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                                {uploadProgress < 100 ? (
                                    <Loader2 size={20} className="animate-spin text-primary" />
                                ) : (
                                    <Check size={20} className="text-emerald-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-zinc-200 truncate max-w-[200px]">{uploadedFile?.name}</span>
                                    <span className="text-zinc-400">{uploadProgress}%</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Channel Selector */}
                            {!channelsLoading && channels.length === 0 && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-blue-200 font-medium mb-1">No channel yet</p>
                                        <p className="text-xs text-blue-300/80 mb-3">You can upload to your account now, or create a channel to organize your videos.</p>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate('/my-channels')}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Create Channel (Optional)
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!channelsLoading && channels.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-zinc-300">Upload to Channel</label>
                                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex items-center gap-3">
                                        {activeChannel ? (
                                            <>
                                                {activeChannel.avatar ? (
                                                    <img
                                                        src={activeChannel.avatar}
                                                        alt={activeChannel.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                        {activeChannel.name[0]}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-white">
                                                        {activeChannel.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        @{activeChannel.handle} • {activeChannel.subscribersCount} subscribers
                                                    </div>
                                                </div>
                                                <Check size={18} className="text-primary" />
                                            </>
                                        ) : (
                                            <div className="text-sm text-zinc-400">No channel selected</div>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Change channel from the switcher in the top navigation
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="Add a title that describes your video"
                                    value={videoData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Description</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none resize-none transition-all placeholder:text-zinc-600"
                                    placeholder="Tell viewers about your video"
                                    value={videoData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Category</label>
                                <select
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all"
                                    value={videoData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    <option value="gaming">Gaming</option>
                                    <option value="music">Music</option>
                                    <option value="tech">Technology</option>
                                    <option value="education">Education</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="sports">Sports</option>
                                    <option value="news">News</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="travel">Travel</option>
                                    <option value="food">Food</option>
                                    <option value="art">Art</option>
                                    <option value="science">Science</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Tags</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                                        placeholder="Add tags (press Enter to add)"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                    />
                                    {videoData.tags && videoData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {videoData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="text-zinc-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Thumbnail</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div
                                        className="aspect-video bg-zinc-900 rounded-lg border border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-800 transition-all group"
                                        onClick={triggerThumbnailInput}
                                    >
                                        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-zinc-300 group-hover:text-white" />
                                        <span className="text-xs text-zinc-300 group-hover:text-white">Upload file</span>
                                    </div>
                                    {thumbnailPreview ? (
                                        <div className="aspect-video bg-zinc-900 rounded-lg border-2 border-primary relative overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Selected thumbnail" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                <div className="bg-primary p-1 rounded-full shadow-lg"><Check size={14} className="text-white" /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center opacity-50">
                                            <span className="text-xs text-zinc-500">No thumbnail</span>
                                        </div>
                                    )}
                                    <div className="aspect-video bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center opacity-30">
                                        <span className="text-xs text-zinc-500">Auto-generate</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Video Type</label>
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex-1 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                        <input
                                            type="radio"
                                            name="videoType"
                                            className="accent-primary w-4 h-4"
                                            checked={!videoData.isShort}
                                            onChange={() => handleInputChange('isShort', false)}
                                        />
                                        <div>
                                            <span className="text-sm font-medium block">Regular Video</span>
                                            <span className="text-xs text-zinc-500">Standard video content</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex-1 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                        <input
                                            type="radio"
                                            name="videoType"
                                            className="accent-primary w-4 h-4"
                                            checked={videoData.isShort}
                                            onChange={() => handleInputChange('isShort', true)}
                                        />
                                        <div>
                                            <span className="text-sm font-medium block">Short Video</span>
                                            <span className="text-xs text-zinc-500">60 seconds or less</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">Visibility</label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex-1 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                        <input
                                            type="radio"
                                            name="vis"
                                            className="accent-primary w-4 h-4"
                                            checked={videoData.visibility === 'public'}
                                            onChange={() => handleInputChange('visibility', 'public')}
                                        />
                                        <span className="text-sm font-medium">Public</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex-1 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                        <input
                                            type="radio"
                                            name="vis"
                                            className="accent-primary w-4 h-4"
                                            checked={videoData.visibility === 'unlisted'}
                                            onChange={() => handleInputChange('visibility', 'unlisted')}
                                        />
                                        <span className="text-sm font-medium">Unlisted</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex-1 cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                                        <input
                                            type="radio"
                                            name="vis"
                                            className="accent-primary w-4 h-4"
                                            checked={videoData.visibility === 'private'}
                                            onChange={() => handleInputChange('visibility', 'private')}
                                        />
                                        <span className="text-sm font-medium">Private</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Preview Card */}
                    <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4 lg:gap-6">
                        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 sticky top-4 shadow-2xl">
                            <div className="aspect-video bg-black relative flex items-center justify-center group">
                                {uploadedFile ? (
                                    <video
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                    >
                                        <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="flex flex-col items-center text-zinc-300 gap-2">
                                        <FileVideo className="w-8 h-8 text-zinc-300" />
                                        <span className="text-sm">Video Preview</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                    <div className="h-8 w-8 bg-zinc-800 rounded-full shrink-0" />
                                </div>
                                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                            </div>
                            <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex flex-col gap-1">
                                <p className="text-xs text-zinc-500">Video Link</p>
                                <a href="#" className="text-primary text-sm truncate block hover:underline">nebulastream.com/v/{Math.random().toString(36).substring(7)}</a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {uploadError && (
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                    {uploadError}
                                </div>
                            )}
                            <Button
                                className="w-full shadow-lg shadow-primary/20"
                                disabled={isUploading || !videoData.title.trim()}
                                onClick={handleUpload}
                            >
                                {isUploading ? 'Uploading...' : 'Publish Video'}
                            </Button>
                            <Button variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700" onClick={() => setStep(1)}>Back to Upload</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
