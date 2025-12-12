import React from 'react';

export const VideoCardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="aspect-video bg-zinc-800 rounded-xl mb-3 skeleton"></div>

            {/* Content Skeleton */}
            <div className="flex gap-3">
                {/* Avatar Skeleton */}
                <div className="w-9 h-9 bg-zinc-800 rounded-full skeleton shrink-0"></div>

                {/* Text Content Skeleton */}
                <div className="flex-1 space-y-2">
                    {/* Title Skeleton */}
                    <div className="h-4 bg-zinc-800 rounded skeleton"></div>
                    <div className="h-4 bg-zinc-800 rounded w-3/4 skeleton"></div>

                    {/* Channel Name Skeleton */}
                    <div className="h-3 bg-zinc-800 rounded w-1/2 skeleton"></div>

                    {/* Views and Date Skeleton */}
                    <div className="h-3 bg-zinc-800 rounded w-2/3 skeleton"></div>
                </div>
            </div>
        </div>
    );
};

export const VideoCardListSkeleton: React.FC = () => {
    return (
        <div className="flex gap-4 animate-pulse p-2">
            {/* Thumbnail Skeleton */}
            <div className="w-40 md:w-64 aspect-video bg-zinc-800 rounded-xl skeleton shrink-0"></div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-2">
                {/* Title Skeleton */}
                <div className="h-4 bg-zinc-800 rounded skeleton"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4 skeleton"></div>

                {/* Channel Info Skeleton */}
                <div className="h-3 bg-zinc-800 rounded w-1/3 skeleton"></div>

                {/* Stats Skeleton */}
                <div className="h-3 bg-zinc-800 rounded w-1/2 skeleton"></div>

                {/* Description Skeleton */}
                <div className="hidden md:block space-y-1">
                    <div className="h-3 bg-zinc-800 rounded skeleton"></div>
                    <div className="h-3 bg-zinc-800 rounded w-2/3 skeleton"></div>
                </div>
            </div>
        </div>
    );
};