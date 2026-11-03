import React from 'react';
import { Language, TeamId, TeamState } from '../game/rules';
import { getText } from '../game/translations';
import {
  Users,
  RefreshCw,
  Divide,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  PauseCircle,
  Zap,
} from 'lucide-react';

interface StudioHUDProps {
  lang: Language;
  onToggleLang: () => void;
  teamA: TeamState;
  teamB: TeamState;
  activeTeam: TeamId;
  isStealAttempt: boolean;
  timeLeft: number;
  isTimerPaused: boolean;
  onToggleTimerPause: () => void;
  onResetTimer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPauseModal: () => void;
  onRestartMatch: () => void;
  canUseLifelines: boolean;
  onUseFiftyFifty: (team: TeamId) => void;
  onUseAskAudience: (team: TeamId) => void;
  onUseSwitchQuestion: (team: TeamId) => void;
}

export const StudioHUD: React.FC<StudioHUDProps> = ({
  lang,
  onToggleLang,
  teamA,
  teamB,
  activeTeam,
  isStealAttempt,
  timeLeft,
  isTimerPaused,
  onToggleTimerPause,
  onResetTimer,
  isMuted,
  onToggleMute,
  onOpenPauseModal,
  onRestartMatch,
  canUseLifelines,
  onUseFiftyFifty,
  onUseAskAudience,
  onUseSwitchQuestion,
}) => {
  const t = getText(lang);

  const renderTeamCard = (team: TeamState, isCurrentTurn: boolean, accent: 'cyan' | 'amber') => {
    const borderClass = isCurrentTurn
      ? accent === 'cyan'
        ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.3)] bg-slate-900/95'
        : 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] bg-slate-900/95'
      : 'border-slate-800 bg-slate-950/75 opacity-80';

    const titleColor = accent === 'cyan' ? 'text-cyan-300' : 'text-amber-300';

    return (
      <div
        data-testid={`team-card-${team.id}`}
        className={`rounded-2xl border-2 p-3 md:p-4 transition-all ${borderClass}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm md:text-base font-extrabold truncate ${titleColor}`}>
                {team.name}
              </span>
              {isCurrentTurn && (
                <span className="text-[11px] font-bold text-emerald-300 whitespace-nowrap">
                  · {isStealAttempt ? t.stealTurnBadge : t.activeTurn}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              <span>{t.correctAnswersStat}: {team.correctCount}</span>
              <span className="mx-1.5">·</span>
              <span>⚡ {team.stealCount}</span>
            </div>
          </div>

          <div className="text-end shrink-0">
            <div
              data-testid={`team-score-${team.id}`}
              className="text-xl md:text-2xl font-black font-mono-num text-white tracking-tight"
            >
              ${team.score.toLocaleString('en-US')}
            </div>
          </div>
        </div>

        {/* Team's 3 Independent Lifelines */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/90">
          <button
            type="button"
            disabled={!isCurrentTurn || !canUseLifelines || !team.lifelines.fiftyFifty}
            onClick={() => onUseFiftyFifty(team.id)}
            title={t.lifeline5050}
            aria-label={`${team.name} - ${t.lifeline5050}`}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
              team.lifelines.fiftyFifty
                ? isCurrentTurn && canUseLifelines
                  ? 'bg-blue-950/90 border-amber-400/70 text-amber-200 hover:bg-amber-400 hover:text-slate-950 cursor-pointer'
                  : 'bg-slate-900 border-slate-700 text-slate-300 cursor-not-allowed'
                : 'bg-slate-950 border-slate-900 text-slate-600 line-through cursor-not-allowed'
            }`}
          >
            <Divide className="w-3.5 h-3.5 shrink-0" />
            <span>50:50</span>
          </button>

          <button
            type="button"
            disabled={!isCurrentTurn || !canUseLifelines || !team.lifelines.askAudience}
            onClick={() => onUseAskAudience(team.id)}
            title={t.lifelineAudience}
            aria-label={`${team.name} - ${t.lifelineAudience}`}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
              team.lifelines.askAudience
                ? isCurrentTurn && canUseLifelines
                  ? 'bg-blue-950/90 border-amber-400/70 text-amber-200 hover:bg-amber-400 hover:text-slate-950 cursor-pointer'
                  : 'bg-slate-900 border-slate-700 text-slate-300 cursor-not-allowed'
                : 'bg-slate-950 border-slate-900 text-slate-600 line-through cursor-not-allowed'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'ar' ? 'الجمهور' : 'Audience'}</span>
          </button>

          <button
            type="button"
            disabled={!isCurrentTurn || !canUseLifelines || !team.lifelines.switchQuestion}
            onClick={() => onUseSwitchQuestion(team.id)}
            title={t.lifelineSwitch}
            aria-label={`${team.name} - ${t.lifelineSwitch}`}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
              team.lifelines.switchQuestion
                ? isCurrentTurn && canUseLifelines
                  ? 'bg-blue-950/90 border-amber-400/70 text-amber-200 hover:bg-amber-400 hover:text-slate-950 cursor-pointer'
                  : 'bg-slate-900 border-slate-700 text-slate-300 cursor-not-allowed'
                : 'bg-slate-950 border-slate-900 text-slate-600 line-through cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'ar' ? 'تبديل' : 'Switch'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Top Studio Utility Controls & Scoreboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Team A Card */}
        <div className="lg:col-span-4">
          {renderTeamCard(teamA, activeTeam === 'A', 'cyan')}
        </div>

        {/* Center Countdown Timer & Host Controls */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center millionaire-hex-box rounded-2xl p-3">
          <div className="flex items-center justify-between w-full gap-2">
            {/* Timer Circle */}
            <div className="flex items-center gap-3">
              <div
                data-testid="turn-timer"
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 font-mono-num text-2xl font-black ${
                  timeLeft <= 10
                    ? 'border-rose-500 bg-rose-950/70 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.45)]'
                    : 'border-amber-400 bg-slate-950 text-amber-300'
                }`}
              >
                {timeLeft}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onToggleTimerPause}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 cursor-pointer"
                    aria-label={isTimerPaused ? t.resumeTimerBtn : t.pauseTimerBtn}
                  >
                    {isTimerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isTimerPaused ? t.resumeTimerBtn : t.pauseTimerBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetTimer}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 cursor-pointer"
                    aria-label={t.resetTimerBtn}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>60s</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">
                  {activeTeam === 'A' ? teamA.name : teamB.name}
                  {isTimerPaused ? ` · ${t.timerPaused}` : ''}
                </span>
              </div>
            </div>

            {/* Studio Utility Icon Buttons (Language, Mute [M], Pause [P], Restart [R]) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleLang();
                }}
                title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                aria-label="Switch Language"
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onToggleMute();
                }}
                title="Mute [M]"
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onOpenPauseModal();
                }}
                title="Pause [P]"
                aria-label="Pause Match"
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 cursor-pointer"
              >
                <PauseCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onRestartMatch();
                }}
                title="Restart [R]"
                aria-label="Restart Match"
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Team B Card */}
        <div className="lg:col-span-4">
          {renderTeamCard(teamB, activeTeam === 'B', 'amber')}
        </div>
      </div>

      {/* Steal Opportunity Alert Banner when active */}
      {isStealAttempt && (
        <div
          data-testid="steal-banner"
          className="w-full rounded-xl bg-amber-500/20 border-2 border-amber-400 px-4 py-2.5 flex items-center justify-between gap-3 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        >
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-black text-sm md:text-base text-white">
                {t.stealTurnBadge} ({activeTeam === 'A' ? teamA.name : teamB.name})
              </span>
              <span className="mx-2 text-amber-400">·</span>
              <span className="text-xs md:text-sm text-amber-100">{t.stealBannerDesc}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
