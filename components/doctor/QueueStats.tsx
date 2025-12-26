"use client";

interface QueueStatsProps {
  waiting: number;
  inProgress: number;
  completed: number;
}

export default function QueueStats({ waiting, inProgress, completed }: QueueStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6">
      {/* Waiting */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 text-center">
        <p className="text-xs md:text-sm text-amber-700 font-medium mb-1">Waiting</p>
        <p className="text-2xl md:text-3xl font-bold text-amber-900">{waiting}</p>
      </div>

      {/* In Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 text-center">
        <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">In Progress</p>
        <p className="text-2xl md:text-3xl font-bold text-blue-900">{inProgress}</p>
      </div>

      {/* Completed */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 text-center">
        <p className="text-xs md:text-sm text-green-700 font-medium mb-1">Completed</p>
        <p className="text-2xl md:text-3xl font-bold text-green-900">{completed}</p>
      </div>
    </div>
  );
}
