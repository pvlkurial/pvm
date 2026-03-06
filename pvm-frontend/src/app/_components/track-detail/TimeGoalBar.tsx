import {
  millisecondsToTimeString,
  calculateTimeDelta,
} from "@/utils/time.utils";

interface TimeGoal {
  name: string;
  time: number;
  multiplier?: number;
}

interface TimeGoalBarProps {
  timeGoals: TimeGoal[];
  personalBest?: number;
}

export function TimeGoalBar({ timeGoals, personalBest }: TimeGoalBarProps) {
  if (timeGoals.length === 0) return null;

  const hasPB = personalBest !== undefined && personalBest > 0;

  const sorted = [...timeGoals].sort((a, b) => b.time - a.time);

  const maxTime = sorted[0].time;
  const minTime = sorted[sorted.length - 1].time;
  const padding = (maxTime - minTime) * 0.2 || maxTime * 0.1;
  const rangeMin = minTime - padding;
  const rangeMax = maxTime + padding;
  const range = rangeMax - rangeMin;

  const toPercent = (ms: number) => ((rangeMax - ms) / range) * 100;

  const pbPercent = hasPB ? toPercent(personalBest!) : null;

  const achievedSet = new Set(
    sorted.filter((g) => hasPB && personalBest! <= g.time).map((g) => g.time),
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative h-1.5 rounded-full bg-white/[0.06] mx-2">
          {pbPercent !== null && (
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/20 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(pbPercent, 0), 100)}%` }}
            />
          )}

          {sorted.map((goal, i) => {
            const pct = toPercent(goal.time);
            const isAchieved = achievedSet.has(goal.time);
            return (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
                    isAchieved
                      ? "bg-green-400 border-green-400"
                      : "bg-neutral-900 border-white/30"
                  }`}
                />
              </div>
            );
          })}

          {pbPercent !== null && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
              style={{ left: `${Math.min(Math.max(pbPercent, 0), 100)}%` }}
            >
              <div className="w-0.5 h-5 bg-white rounded-full -translate-y-[4px]" />
            </div>
          )}
        </div>

        <div className="relative mt-4 h-auto">
          {sorted.map((goal, i) => {
            const pct = toPercent(goal.time);
            const isAchieved = achievedSet.has(goal.time);
            const delta = hasPB
              ? calculateTimeDelta(personalBest!, goal.time)
              : null;

            const isFirst = i === 0;
            const isLast = i === sorted.length - 1;
            const align = isFirst
              ? "items-start"
              : isLast
                ? "items-end"
                : "items-center";
            const textAlign = isFirst
              ? "text-left"
              : isLast
                ? "text-right"
                : "text-center";
            const translate = isFirst
              ? "translate-x-0"
              : isLast
                ? "-translate-x-full"
                : "-translate-x-1/2";

            return (
              <div
                key={i}
                className={`absolute flex flex-col gap-0.5 ${align} ${translate}`}
                style={{ left: `${pct}%` }}
              >
                <p
                  className={`text-[10px] tracking-widest uppercase ${textAlign} ${
                    isAchieved ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {goal.name}
                </p>

                <p
                  className={`font-ruigslay text-sm leading-none ${textAlign} ${
                    isAchieved ? "text-white" : "text-neutral-500"
                  }`}
                >
                  {millisecondsToTimeString(goal.time)}
                </p>

                {delta ? (
                  <p
                    className={`text-[10px] font-mono font-bold ${textAlign} ${
                      delta.isAchieved ? "text-blue-400" : "text-red-400"
                    }`}
                  >
                    {delta.formatted}
                  </p>
                ) : (
                  <p className={`text-[10px] ${textAlign} text-neutral-700`}>
                    —
                  </p>
                )}

                {goal.multiplier !== undefined && (
                  <p className={`text-[10px] ${textAlign} text-neutral-700`}>
                    ×{goal.multiplier}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hasPB && (
        <div className="flex items-center gap-2 pt-2">
          <div className="w-0.5 h-4 bg-white/40 rounded-full" />
          <span className="text-neutral-500 text-[10px] tracking-widest uppercase">
            PB
          </span>
          <span className="font-mono text-white text-sm">
            {millisecondsToTimeString(personalBest!)}
          </span>
        </div>
      )}
    </div>
  );
}
