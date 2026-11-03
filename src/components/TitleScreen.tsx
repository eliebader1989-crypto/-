import React from 'react';
import { Language, StealRuleMode } from '../game/rules';
import { getText } from '../game/translations';
import { Sparkles, PlusCircle, RotateCcw, Volume2, VolumeX, Globe, ShieldAlert, Zap } from 'lucide-react';

interface TitleScreenProps {
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  teamAName: string;
  setTeamAName: (val: string) => void;
  teamBName: string;
  setTeamBName: (val: string) => void;
  stealRuleMode: StealRuleMode;
  setStealRuleMode: (mode: StealRuleMode) => void;
  totalQuestionsCount: number;
  unusedQuestionsCount: number;
  customQuestionsCount: number;
  onResetUsedQuestions: () => void;
  onOpenCustomModal: () => void;
  onOpenAiModal: () => void;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  teamAName,
  setTeamAName,
  teamBName,
  setTeamBName,
  stealRuleMode,
  setStealRuleMode,
  totalQuestionsCount,
  unusedQuestionsCount,
  customQuestionsCount,
  onResetUsedQuestions,
  onOpenCustomModal,
  onOpenAiModal,
  onStartGame,
}) => {
  const t = getText(lang);
  const isRtl = lang === 'ar';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen w-full studio-arena-bg text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden ${
        isRtl ? 'font-studio-ar' : 'font-studio-en'
      }`}
    >
      {/* Ambient Studio Spotlight Rays (Decorative SVG) */}
      <svg
        className="pointer-events-none fixed inset-0 w-full h-full opacity-25"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="goldCore" cx="50%" cy="22%" r="45%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#goldCore)" />
        <g stroke="#d4af37" strokeOpacity="0.18" strokeWidth="1">
          <circle cx="720" cy="210" r="140" fill="none" />
          <circle cx="720" cy="210" r="220" fill="none" strokeDasharray="6 8" />
          <circle cx="720" cy="210" r="310" fill="none" />
          <line x1="0" y1="210" x2="1440" y2="210" />
          <line x1="720" y1="0" x2="720" y2="900" />
        </g>
      </svg>

      {/* Top Utility Row */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3 text-xs md:text-sm text-amber-300/90 font-medium">
          <span>{t.questionBankStatus}:</span>
          <span className="font-mono-num font-bold text-white">
            {unusedQuestionsCount}/{totalQuestionsCount}
          </span>
          <span className="text-slate-400">({t.unusedQuestions})</span>
          {customQuestionsCount > 0 && (
            <span className="text-emerald-300">+{customQuestionsCount} AI/Custom</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-200 hover:border-amber-400 hover:text-white text-xs md:text-sm font-semibold transition-colors cursor-pointer"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-200 hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Studio Stage Split Layout */}
      <main className="relative z-10 max-w-6xl w-full mx-auto my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left/Right Column: Bespoke SVG Studio Emblem & Prize Ladder Preview */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 md:w-56 md:h-56 mb-4 flex items-center justify-center">
            <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
              <defs>
                <linearGradient id="emblemRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <radialGradient id="emblemCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="70%" stopColor="#091538" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
              </defs>
              {/* Outer Octagon / Hexagon Studio Frame */}
              <polygon
                points="120,8 198,42 232,120 198,198 120,232 42,198 8,120 42,42"
                fill="url(#emblemCenter)"
                stroke="url(#emblemRing)"
                strokeWidth="4"
              />
              {/* Concentric Gold Rings */}
              <circle cx="120" cy="120" r="92" fill="none" stroke="url(#emblemRing)" strokeWidth="2" strokeDasharray="8 4" />
              <circle cx="120" cy="120" r="76" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.6" />
              {/* Geometric Star Rays */}
              <polygon
                points="120,32 136,96 200,120 136,144 120,208 104,144 40,120 104,96"
                fill="#f59e0b"
                fillOpacity="0.18"
                stroke="url(#emblemRing)"
                strokeWidth="1.5"
              />
              {/* Center 1,000,000 Medallion */}
              <circle cx="120" cy="120" r="52" fill="#061234" stroke="url(#emblemRing)" strokeWidth="3" />
              <text
                x="120"
                y="112"
                textAnchor="middle"
                fill="#fef08a"
                fontSize="18"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
              >
                1,000,000
              </text>
              <text
                x="120"
                y="136"
                textAnchor="middle"
                fill="#93c5fd"
                fontSize="11"
                fontWeight="700"
              >
                {lang === 'ar' ? 'تحدي الفريقين' : '2-TEAM BATTLE'}
              </text>
            </svg>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-amber-300 mb-2"
            style={{ textWrap: 'balance' }}
          >
            {t.appTitle}
          </h1>
          <p className="text-sm md:text-base text-blue-200/90 max-w-md mb-6">
            {t.appSubtitle}
          </p>

          {/* 3-Tier Difficulty Summary Strip */}
          <div className="w-full max-w-md millionaire-hex-box rounded-xl bg-slate-950/85 border border-amber-500/30 p-4 text-xs md:text-sm space-y-2">
            <div className="flex items-center justify-between text-emerald-300">
              <span>{t.tier1Name}</span>
              <span className="font-mono-num font-bold">100 → 1,000</span>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="flex items-center justify-between text-amber-300">
              <span>{t.tier2Name}</span>
              <span className="font-mono-num font-bold">2,000 → 32,000</span>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="flex items-center justify-between text-rose-300">
              <span>{t.tier3Name}</span>
              <span className="font-mono-num font-bold">64,000 → 1,000,000</span>
            </div>
          </div>
        </div>

        {/* Right/Left Column: Battle Setup Card */}
        <form
          onSubmit={handleFormSubmit}
          className="lg:col-span-7 millionaire-hex-box rounded-2xl p-6 md:p-8 space-y-6"
        >
          {/* Team Names Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="team-a-input"
                className="block text-xs md:text-sm font-bold text-cyan-300 mb-2"
              >
                {t.teamALabel}
              </label>
              <input
                id="team-a-input"
                type="text"
                required
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                placeholder={t.defaultTeamA}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-white font-bold focus:outline-none focus:border-cyan-300 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="team-b-input"
                className="block text-xs md:text-sm font-bold text-amber-300 mb-2"
              >
                {t.teamBLabel}
              </label>
              <input
                id="team-b-input"
                type="text"
                required
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                placeholder={t.defaultTeamB}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-amber-500/50 text-white font-bold focus:outline-none focus:border-amber-300 transition-colors"
              />
            </div>
          </div>

          {/* Steal Mechanic Selector */}
          <div>
            <span className="block text-xs md:text-sm font-bold text-slate-200 mb-2.5">
              {t.stealRuleTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStealRuleMode('steal_answer')}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                  stealRuleMode === 'steal_answer'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300 mb-1">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{t.stealAnswerMode}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {t.stealAnswerDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStealRuleMode('direct_award')}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                  stealRuleMode === 'direct_award'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-cyan-300 mb-1">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{t.directAwardMode}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {t.directAwardDesc}
                </p>
              </button>
            </div>
          </div>

          {/* Question Bank Management Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenAiModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-950/90 border border-blue-400/50 hover:border-blue-300 text-blue-100 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.generateAiBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400/60 text-slate-200 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.addCustomBtn}</span>
            </button>

            <button
              type="button"
              onClick={onResetUsedQuestions}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetUsedBtn}</span>
            </button>
          </div>

          {/* Primary Start Game CTA */}
          <button
            type="submit"
            data-start="true"
            className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg md:text-xl tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.45)] transition-transform active:scale-[0.99] cursor-pointer"
          >
            {t.startBattleBtn}
          </button>
        </form>
      </main>

      {/* Flat Borderless Control Hint Line at Bottom Safe Margin */}
      <div className="relative z-10 text-center text-xs text-slate-400/80 pt-2">
        {t.controlHints}
      </div>
    </div>
  );
};
