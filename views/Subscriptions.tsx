import React, { useState, useEffect } from 'react';
import { Bell, Users, Video as VideoIcon } from 'lucide-react';
import { subscriptionService, Subscription } from '../services/subscriptionService';
import { videoService, Video } from '../services/videoService';
import { RealVideoCard } from '../components/RealVideoCard';

const Subscriptions: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [subscriptionVideos, setSubscriptionVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'videos' | 'channels'>('videos');

    useEffect(() => {
        loadSubscriptions();
        loadSubscriptionVideos();
    }, []);

    const loadSubscriptions = async () => {
        try {
            const subs = await subscriptionService.getMySubscriptions();
            setSubscriptions(subs);
        } catch (error) {
            console.error('Failed to load subscriptions:', error);
        }
    };

    const loadSubscriptionVideos = async () => {
        try {
            setLoading(true);
            // For now, we'll show all videos since we don't have a specific endpoint for subscription feed
            // In a real implementation, you'd have an endpoint that returns videos from subscribed channels
            const allVideos = await videoService.getAllVideos();
            setSubscriptionVideos(allVideos);
        } catch (error) {
            console.error('Failed to load subscription videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatSubscriberCount = (count: number): string => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Users className="text-red-500" size={24} />
                    Subscriptions
                </h1>

                {/* Tabs */}
                <div className="flex space-x-1 bg-zinc-900 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'videos'
                            ? 'bg-white text-black'
                            : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        <VideoIcon size={16} className="inline mr-2" />
                        Latest Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'channels'
                            ? 'bg-white text-black'
                            : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        <Users size={16} className="inline mr-2" />
                        Channels ({subscriptions.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'videos' ? (
                <div>
                    {subscriptionVideos.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <VideoIcon size={32} className="text-zinc-500" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">No videos from subscriptions</h2>
                            <p className="text-zinc-500">Subscribe to channels to see their latest videos here!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                            {subscriptionVideos.map((video) => (
                                <RealVideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-zinc-500" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">No subscriptions yet</h2>
                            <p className="text-zinc-500">Start subscribing to channels to build your feed!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.map((subscription) => (
                                <div
                                    key={subscription.id}
                                    className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                                            {subscription.channel.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">
                                                {subscription.channel.name}
                                            </h3>
                                            <p className="text-zinc-400 text-sm">
                                                {formatSubscriberCount(subscription.channel.subscribersCount)} subscribers
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                            <Bell size={14} />
                                            <span>
                                                {subscription.notificationsEnabled ? 'Notifications on' : 'Notifications off'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-zinc-500">
                                            Subscribed {new Date(subscription.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Subscriptions;