import React from 'react';
import { Language, PRIZE_LADDER, StepResult } from '../game/rules';
import { getText } from '../game/translations';

interface PrizeLadderProps {
  lang: Language;
  currentLevel: number;
  stepResults: Record<number, StepResult>;
  teamAName: string;
  teamBName: string;
}

export const PrizeLadder: React.FC<PrizeLadderProps> = ({
  lang,
  currentLevel,
  stepResults,
  teamAName,
  teamBName,
}) => {
  const t = getText(lang);
  const stepsDescending = [...PRIZE_LADDER].reverse();

  return (
    <aside
      aria-label={t.prizeLadderTitle}
      className="millionaire-hex-box rounded-2xl p-3 md:p-4 flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
        <h2 className="text-xs md:text-sm font-extrabold text-amber-300 tracking-wide">
          {t.prizeLadderTitle}
        </h2>
        <span className="text-[11px] text-slate-400 font-mono-num">
          {currentLevel}/15
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-between gap-1 py-1">
        {stepsDescending.map((step) => {
          const isCurrent = step.level === currentLevel;
          const isPast = step.level < currentLevel;
          const result = stepResults[step.level];

          const tierBadge =
            step.level === 15
              ? t.tierShort3
              : step.level === 10
              ? t.tierShort2
              : step.level === 5
              ? t.tierShort1
              : null;

          return (
            <div
              key={step.level}
              data-level={step.level}
              data-active={isCurrent ? 'true' : 'false'}
              className={`flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition-colors ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : isPast
                  ? 'bg-slate-900/75 text-slate-400'
                  : step.isMilestone
                  ? 'bg-blue-950/60 text-amber-200 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`font-mono-num w-5 text-end ${
                    isCurrent
                      ? 'text-slate-950 font-black'
                      : step.isMilestone
                      ? 'text-amber-300 font-bold'
                      : 'text-amber-500/80'
                  }`}
                >
                  {step.level}
                </span>
                <span className="text-slate-500">·</span>
                <span className="font-mono-num tracking-tight truncate">
                  ${step.formattedAmount}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {result && result.winnerTeam === 'A' && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCurrent ? 'bg-slate-950 text-cyan-300' : 'text-cyan-300'
                    }`}
                    title={teamAName}
                  >
                    {result.wasStolen ? `⚡ ${teamAName.slice(0, 8)}` : teamAName.slice(0, 8)}
                  </span>
                )}
                {result && result.winnerTeam === 'B' && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCurrent ? 'bg-slate-950 text-amber-300' : 'text-amber-300'
                    }`}
                    title={teamBName}
                  >
                    {result.wasStolen ? `⚡ ${teamBName.slice(0, 8)}` : teamBName.slice(0, 8)}
                  </span>
                )}
                {!result && tierBadge && (
                  <span
                    className={`text-[10px] font-semibold ${
                      isCurrent ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {tierBadge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
