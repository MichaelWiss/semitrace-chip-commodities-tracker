import React from 'react';

export const CommodityCardSkeleton: React.FC = () => (
  <div className="border-b border-subtle py-8 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
      <div className="flex items-center gap-8 w-full md:w-1/3">
        <div className="w-8 h-8 rounded-full bg-subtle"></div>
        <div className="space-y-2">
          <div className="h-8 w-48 bg-subtle rounded"></div>
          <div className="h-3 w-24 bg-subtle rounded"></div>
        </div>
      </div>
      <div className="flex items-center gap-8 md:gap-16 w-full md:w-1/3 justify-start md:justify-center">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-subtle rounded"></div>
          <div className="h-3 w-12 bg-subtle rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 w-16 bg-subtle rounded"></div>
          <div className="h-3 w-20 bg-subtle rounded"></div>
        </div>
      </div>
      <div className="w-full md:w-1/3 h-16 bg-subtle rounded opacity-50"></div>
    </div>
  </div>
);

export const PowerHubSkeleton: React.FC = () => (
  <div className="w-full py-24 border-t border-text/10 bg-[#F4F1EA]">
    <div className="max-w-[90vw] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-pulse">
        <div className="space-y-4 w-full max-w-xl">
          <div className="h-4 w-32 bg-subtle rounded"></div>
          <div className="h-16 w-3/4 bg-subtle rounded"></div>
          <div className="h-6 w-1/2 bg-subtle rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 h-[400px] bg-subtle rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-subtle rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ToolingCardSkeleton: React.FC = () => (
  <div className="bg-surface border border-text/10 p-8 animate-pulse h-[400px]">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-subtle rounded"></div>
        <div className="h-3 w-20 bg-subtle rounded"></div>
      </div>
      <div className="space-y-2 text-right">
        <div className="h-6 w-24 bg-subtle rounded ml-auto"></div>
        <div className="h-3 w-16 bg-subtle rounded ml-auto"></div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="h-12 bg-subtle rounded"></div>
      <div className="h-12 bg-subtle rounded"></div>
      <div className="col-span-2 h-8 bg-subtle rounded"></div>
    </div>
    <div className="h-32 bg-subtle rounded mt-auto"></div>
  </div>
);

export const ToolingTrackerSkeleton: React.FC = () => (
  <div className="w-full py-24 bg-background border-t border-text/10">
    <div className="max-w-[90vw] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-6 md:px-0 animate-pulse">
        <div className="space-y-4 w-full max-w-xl">
          <div className="h-4 w-32 bg-subtle rounded"></div>
          <div className="h-16 w-3/4 bg-subtle rounded"></div>
          <div className="h-6 w-1/2 bg-subtle rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <ToolingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
