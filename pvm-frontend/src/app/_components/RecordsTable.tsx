"use client";
import { Pagination } from "@heroui/react";
import { Record } from "@/types/mappack.types";
import { useMemo, useState } from "react";
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
  loggedInPlayerId?: string;
}

export default function RecordsTable({ 
  records, 
  timeGoals = [],
  loggedInPlayerId 
}: RecordsTableProps) {
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.score - b.score);
  }, [records]);

  const loggedInRecord = useMemo(() => {
    if (!loggedInPlayerId) return null;
    return sortedRecords.find(r => r.player.ID === loggedInPlayerId);
  }, [sortedRecords, loggedInPlayerId]);

  const loggedInPosition = useMemo(() => {
    if (!loggedInRecord) return null;
    return sortedRecords.indexOf(loggedInRecord) + 1;
  }, [sortedRecords, loggedInRecord]);

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return sortedRecords.slice(start, end);
  }, [sortedRecords, page]);

  const pages = Math.ceil(sortedRecords.length / recordsPerPage);
  const totalRecords = sortedRecords.length;

  const getPositionStyle = (position: number) => {
    if (position === 1) return "text-yellow-400 font-bold";
    if (position === 2) return "text-gray-300 font-bold";
    if (position === 3) return "text-amber-600 font-bold";
    return "text-white/60";
  };

  const renderRecord = (record: Record, position: number, isPinnedRecord: boolean = false) => {
    const achievedGoal = getBestAchievedTimeGoal(record.score, timeGoals);
    const isLoggedInPlayer = loggedInPlayerId === record.player.ID;
    
    return (
      <div key={`${record.mapRecordId}-${isPinnedRecord ? 'pinned' : 'normal'}`}>
        <div className={`
          grid grid-cols-[40px_1fr_90px] md:grid-cols-[50px_1fr_140px_140px_100px] 
          gap-2 md:gap-6 px-2 py-3 md:py-4 
          hover:bg-white/[0.02] transition-colors
          ${isLoggedInPlayer && isPinnedRecord ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''}
          ${isLoggedInPlayer && !isPinnedRecord ? 'bg-blue-500/5 border-l-2 border-blue-500/50' : ''}
        `}>
          <div className="flex items-center justify-center">
            <span className={`text-base md:text-lg font-mono ${getPositionStyle(position)}`}>
              {position}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center min-w-0 gap-1 md:gap-0">
            <div className="flex items-center min-w-0">
              <span className="text-sm md:text-base text-white truncate">
                {record.player.name}
                {isLoggedInPlayer && isPinnedRecord && (
                  <span className="ml-2 text-xs text-blue-400 font-semibold">(You)</span>
                )}
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <span className="text-xs text-white/40">
                {formatRelativeTime(record.updatedAt)}
              </span>
              {achievedGoal && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-xs">
                  {achievedGoal}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end md:justify-center">
            <span className="text-sm md:text-base font-mono text-white/90">
              {millisecondsToTimeString(record.score)}
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center">
            {achievedGoal ? (
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                {achievedGoal}
              </span>
            ) : (
              <span className="text-white/20 text-sm">—</span>
            )}
          </div>

          <div className="hidden md:flex items-center justify-end">
            <span className="text-sm text-white/30">
              {formatRelativeTime(record.updatedAt)}
            </span>
          </div>
        </div>
        
        <div className="h-px bg-white/5" />
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:grid grid-cols-[50px_1fr_140px_140px_100px] gap-6 px-2 text-xs uppercase tracking-wider text-white/30 font-semibold">
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-center">Time</span>
        <span className="text-center">Timegoal</span>
        <span className="text-right">Last Updated</span>
      </div>

      <div className="md:hidden grid grid-cols-[40px_1fr_90px] gap-2 px-2 text-xs uppercase tracking-wider text-white/30 font-semibold">
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-right">Time</span>
      </div>

      <div className="space-y-0">
        {totalRecords === 0 ? (
          <div className="text-center py-12 md:py-16">
            <p className="text-white/40 text-base md:text-lg">No records yet</p>
            <p className="text-white/30 text-sm mt-2">If records are supposed to be here contact an admin</p>
          </div>
        ) : (
          <>
            {/* Always show logged-in player's record first (pinned) */}
            {loggedInRecord && loggedInPosition && renderRecord(
              loggedInRecord, 
              loggedInPosition,
              true
            )}
            
            {/* Show separator between pinned and paginated records */}
            {loggedInRecord && (
              <div className="h-[2px] bg-white/10 my-2" />
            )}
            
            {/* Show paginated records (including logged-in player in their actual position) */}
            {paginatedRecords.map((record, index) => {
              const actualPosition = (page - 1) * recordsPerPage + index + 1;
              return renderRecord(record, actualPosition, false);
            })}
          </>
        )}
      </div>

      {totalRecords > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 md:pt-6 border-t border-white/5">
          <p className="text-xs md:text-sm text-white/30">
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