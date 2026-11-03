import React from 'react';
import { GameShellState, Language, TeamState } from '../game/rules';
import { getText } from '../game/translations';
import { Trophy, Play, RotateCcw, Home } from 'lucide-react';

interface StatusModalsProps {
  lang: Language;
  shellState: GameShellState;
  teamA: TeamState;
  teamB: TeamState;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const StatusModals: React.FC<StatusModalsProps> = ({
  lang,
  shellState,
  teamA,
  teamB,
  onResume,
  onRestart,
  onReturnTitle,
}) => {
  const t = getText(lang);
  const isRtl = lang === 'ar';

  if (shellState !== 'paused' && shellState !== 'gameover') {
    return null;
  }

  if (shellState === 'paused') {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        role="dialog"
        aria-modal="true"
        aria-label={t.pauseModalTitle}
      >
        <div className="millionaire-hex-box rounded-2xl max-w-md w-full p-6 text-center space-y-5">
          <h2 className="text-2xl font-black text-amber-300">{t.pauseModalTitle}</h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40">
              <div className="font-bold text-cyan-300 truncate">{teamA.name}</div>
              <div className="font-mono-num text-lg font-black text-white mt-1">
                ${teamA.score.toLocaleString('en-US')}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/40">
              <div className="font-bold text-amber-300 truncate">{teamB.name}</div>
              <div className="font-mono-num text-lg font-black text-white mt-1">
                ${teamB.score.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onResume}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>{t.resumeGameBtn}</span>
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.restartBattleBtn}</span>
            </button>

            <button
              type="button"
              onClick={onReturnTitle}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{t.returnTitleBtn}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Victory / Match Complete Modal ('gameover')
  const isTie = teamA.score === teamB.score;
  const winner = teamA.score > teamB.score ? teamA : teamB;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85"
      role="dialog"
      aria-modal="true"
      aria-label={t.victoryModalTitle}
    >
      <div className="millionaire-hex-box rounded-2xl max-w-xl w-full p-6 md:p-8 text-center space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-300">
            {t.victoryModalTitle}
          </h2>
          <p className="text-base md:text-lg font-bold text-white">
            {isTie
              ? t.tieAnnouncement
              : `${t.winnerAnnouncement}: ${winner.name}!`}
          </p>
        </div>

        {/* 2-Team Final Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[teamA, teamB].map((team, idx) => {
            const isChampion = !isTie && winner.id === team.id;
            return (
              <div
                key={team.id}
                className={`p-4 rounded-xl border-2 text-start space-y-2 ${
                  isChampion
                    ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-black text-base ${
                      idx === 0 ? 'text-cyan-300' : 'text-amber-300'
                    }`}
                  >
                    {team.name}
                  </span>
                  {isChampion && <Trophy className="w-4 h-4 text-amber-400" />}
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">{t.totalPrizeEarned}</div>
                  <div className="font-mono-num text-2xl font-black text-white">
                    ${team.score.toLocaleString('en-US')}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    {t.correctAnswersStat}: <strong className="font-mono-num text-white">{team.correctCount}</strong>
                  </span>
                  <span>
                    {t.successfulStealsStat}: <strong className="font-mono-num text-amber-300">{team.stealCount}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            data-start="true"
            onClick={onRestart}
            className="flex-1 py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.playAgainBtn}</span>
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t.returnTitleBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
