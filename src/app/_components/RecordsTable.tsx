"use client";
import { Pagination } from "@heroui/react";
import { Record } from "@/types/mappack.types";
import { useRecordsPagination } from "@/hooks/useRecordsPagination";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { formatRelativeTime } from "@/utils/date.utils";
import { getBestAchievedTimeGoal } from "@/utils/record.utils";

interface TimeGoal {
  name: string;
  time: number;
}

interface RecordsTableProps {
  records: Record[];
  timeGoals?: TimeGoal[];
}

export default function RecordsTable({ records, timeGoals = [] }: RecordsTableProps) {
  const { page, pages, setPage, paginatedRecords, totalRecords } = 
    useRecordsPagination(records, 10);

  const getPositionStyle = (position: number) => {
    if (position === 1) return "text-yellow-400 font-bold";
    if (position === 2) return "text-gray-300 font-bold";
    if (position === 3) return "text-amber-600 font-bold";
    return "text-white/60";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-[50px_1fr_140px_140px_100px] gap-6 px-2 text-xs uppercase tracking-wider text-white/30 font-semibold">
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-center">Time</span>
        <span className="text-center">Timegoal</span>
        <span className="text-right">Last Updated</span>
      </div>

      {/* Records List */}
      <div className="space-y-0">
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-lg">No records yet</p>
            <p className="text-white/30 text-sm mt-2">If records are supposed to be here contact an admin</p>
          </div>
        ) : (
          paginatedRecords.map((record, index) => {
            const achievedGoal = getBestAchievedTimeGoal(record.score, timeGoals);
            
            return (
              <div key={record.mapRecordId}>
                <div className="grid grid-cols-[50px_1fr_140px_140px_100px] gap-6 px-2 py-4 hover:bg-white/[0.02] transition-colors">
                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    <span className={`text-lg font-mono ${getPositionStyle(record.position)}`}>
                      {record.position}
                    </span>
                  </div>

                  {/* Player Name */}
                  <div className="flex items-center min-w-0">
                    <span className="text-base text-white truncate">
                      {record.player.name}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-center">
                    <span className="text-base font-mono text-white/90">
                      {millisecondsToTimeString(record.score)}
                    </span>
                  </div>

                  {/* Time Goal Achievement */}
                  <div className="flex items-center justify-center">
                    {achievedGoal ? (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                        {achievedGoal}
                      </span>
                    ) : (
                      <span className="text-white/20 text-sm">—</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-end">
                    <span className="text-sm text-white/30">
                      {formatRelativeTime(record.updatedAt)}
                    </span>
                  </div>
                </div>
                
                {/* Separator */}
                {index < paginatedRecords.length - 1 && (
                  <div className="h-px bg-white/5" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer: Stats & Pagination */}
      {totalRecords > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <p className="text-sm text-white/30">
            {totalRecords.toLocaleString()} {totalRecords === 1 ? 'record' : 'records'}
          </p>
          
          {pages > 1 && (
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              showControls
              size="sm"
              classNames={{
                wrapper: "gap-1",
                item: "bg-transparent text-white/40 hover:text-white/70 hover:bg-white/5 min-w-8 w-8 h-8 border-none",
                cursor: "bg-white/10 text-white font-semibold border-none",
                prev: "bg-transparent hover:bg-white/5 border-none",
                next: "bg-transparent hover:bg-white/5 border-none",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}