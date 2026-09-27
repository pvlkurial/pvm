"use client";
import { useMemo, useState } from "react";
import { Record } from "@/types/mappack.types";
import { millisecondsToTimeString } from "@/utils/time.utils";
import { formatRelativeTime } from "@/utils/date.utils";
import { getBestAchievedTimeGoal } from "@/utils/record.utils";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";

const RECORDS_PER_PAGE = 10;

/** Column templates for the mobile and desktop layouts. */
const MOBILE_COLUMNS = "grid-cols-[40px_1fr_90px]";
const DESKTOP_COLUMNS = "md:grid-cols-[50px_1fr_140px_140px_100px]";

const PODIUM_COLORS: { [position: number]: string } = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

interface TimeGoal {
  name: string;
  time: number;
}

interface RecordsTableProps {
  records?: Record[] | null;
  timeGoals?: TimeGoal[] | null;
  loggedInPlayerId?: string;
}

/** "3d ago", with the exact date and time on hover. */
function RecordDate({ timestamp }: { timestamp: number }) {
  const date = new Date(timestamp * 1000);

  return (
    <div className="group relative inline-block">
      <div className="cursor-default text-small text-faint">
        {formatRelativeTime(date.toDateString())}
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 flex -translate-x-1/2 flex-col items-center rounded-md border border-border bg-surface-1 px-2 py-1 tabular-nums text-caption whitespace-nowrap text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
        <span>{date.toLocaleDateString()}</span>
        <span className="mt-1">{date.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

interface RecordRowProps {
  record: Record;
  position: number;
  achievedGoal: string | null;
  isLoggedInPlayer: boolean;
  /** The signed-in player's own record, repeated above the list. */
  isPinned?: boolean;
}

function RecordRow({
  record,
  position,
  achievedGoal,
  isLoggedInPlayer,
  isPinned = false,
}: RecordRowProps) {
  return (
    <div
      className={cn(
        "grid gap-2 border-b border-border-subtle px-2 py-3 transition-colors hover:bg-surface-2 md:gap-6 md:py-4",
        MOBILE_COLUMNS,
        DESKTOP_COLUMNS,
        isLoggedInPlayer && "border-l-2 border-l-foreground bg-surface-2",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center tabular-nums text-ui",
          PODIUM_COLORS[position] ?? "text-muted-foreground",
        )}
      >
        {position}
      </span>

      <div className="flex min-w-0 flex-col gap-1 md:flex-row md:items-center md:gap-0">
        <span className="truncate text-small text-foreground md:text-ui">
          {record.player.name}
          {isPinned && <span className="ml-2 text-muted-foreground">(You)</span>}
        </span>
        <div className="flex items-center gap-2 md:hidden">
          {achievedGoal && (
            <span className="text-caption text-muted-foreground">
              {achievedGoal}
            </span>
          )}
          <RecordDate timestamp={record.timestamp} />
        </div>
      </div>

      <span className="flex items-center justify-end tabular-nums text-ui md:justify-center">
        {millisecondsToTimeString(record.score)}
      </span>

      <span className="hidden items-center justify-center text-caption text-muted-foreground md:flex">
        {achievedGoal ?? <span className="text-faint">—</span>}
      </span>

      <div className="hidden items-center justify-end md:flex">
        <RecordDate timestamp={record.timestamp} />
      </div>
    </div>
  );
}

export function RecordsTable({
  records,
  timeGoals,
  loggedInPlayerId,
}: RecordsTableProps) {
  const [page, setPage] = useState(1);

  const sortedRecords = useMemo(
    () => [...(records ?? [])].sort((a, b) => a.score - b.score),
    [records],
  );

  const loggedInIndex = loggedInPlayerId
    ? sortedRecords.findIndex((r) => r.player.ID === loggedInPlayerId)
    : -1;
  const loggedInRecord = sortedRecords[loggedInIndex];

  const pageStart = (page - 1) * RECORDS_PER_PAGE;
  const pageRecords = sortedRecords.slice(pageStart, pageStart + RECORDS_PER_PAGE);
  const pageCount = Math.ceil(sortedRecords.length / RECORDS_PER_PAGE);
  const totalRecords = sortedRecords.length;

  const rowProps = (record: Record) => ({
    record,
    achievedGoal: getBestAchievedTimeGoal(record.score, timeGoals),
    isLoggedInPlayer: record.player.ID === loggedInPlayerId,
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div
        className={cn(
          "grid gap-2 px-2 text-caption text-faint md:gap-6",
          MOBILE_COLUMNS,
          DESKTOP_COLUMNS,
        )}
      >
        <span className="text-center">#</span>
        <span>Player</span>
        <span className="text-right md:text-center">Time</span>
        <span className="hidden text-center md:block">Timegoal</span>
        <span className="hidden text-right md:block">Achieved</span>
      </div>

      {totalRecords === 0 ? (
        <div className="py-12 text-center md:py-16">
          <p className="font-display text-title text-muted-foreground">No records yet</p>
          <p className="mt-2 text-small text-faint">
            If records are supposed to be here contact an admin
          </p>
        </div>
      ) : (
        <>
          <div>
            {loggedInRecord && (
              <>
                <RecordRow
                  {...rowProps(loggedInRecord)}
                  position={loggedInIndex + 1}
                  isPinned
                />
                <div className="my-2 h-0.5 bg-border" />
              </>
            )}

            {pageRecords.map((record, index) => (
              <RecordRow
                key={record.mapRecordId}
                {...rowProps(record)}
                position={pageStart + index + 1}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-4 md:flex-row md:pt-6">
            <p className="tabular-nums text-caption text-faint">
              {totalRecords.toLocaleString()} {totalRecords === 1 ? "record" : "records"}
            </p>
            {pageCount > 1 && (
              <Pagination page={page} total={pageCount} onChange={setPage} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
