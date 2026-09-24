import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-pulse">
      {/* Breaking News Skeleton */}
      <div className="h-10 bg-neutral-200 dark:bg-slate-800 rounded-lg w-full" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Slider Skeleton */}
          <div className="h-[460px] bg-neutral-200 dark:bg-slate-800 rounded-2xl w-full" />

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-neutral-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 bg-neutral-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-[250px] bg-neutral-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-72 bg-neutral-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
