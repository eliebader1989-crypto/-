import React from 'react';
import {
  DifficultyTier,
  Language,
  PrizeStep,
  QuestionItem,
  TeamId,
} from '../game/rules';
import { getText } from '../game/translations';
import { BarChart3, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';

export type QuestionPhase = 'answering' | 'locked' | 'revealed';

interface QuestionStageProps {
  lang: Language;
  question: QuestionItem;
  currentStep: PrizeStep;
  activeTeam: TeamId;
  activeTeamName: string;
  phase: QuestionPhase;
  selectedOption: number | null;
  eliminatedOptions: number[];
  wrongAttemptOption: number | null;
  audiencePoll: [number, number, number, number] | null;
  resolutionBannerText: string | null;
  resolutionBannerTone: 'correct' | 'steal' | 'direct' | 'missed' | null;
  onSelectOption: (index: number) => void;
  onLockInAnswer: () => void;
  onNextQuestion: () => void;
}

export const QuestionStage: React.FC<QuestionStageProps> = ({
  lang,
  question,
  currentStep,
  activeTeam,
  activeTeamName,
  phase,
  selectedOption,
  eliminatedOptions,
  wrongAttemptOption,
  audiencePoll,
  resolutionBannerText,
  resolutionBannerTone,
  onSelectOption,
  onLockInAnswer,
  onNextQuestion,
}) => {
  const t = getText(lang);
  const localized = question[lang];

  const getTierLabel = (tier: DifficultyTier) => {
    if (tier === 1) return t.tier1Name;
    if (tier === 2) return t.tier2Name;
    return t.tier3Name;
  };

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      {/* Studio Centerpiece Stage Info Strip & Audience Poll Overlay */}
      <div className="flex flex-col gap-3 my-auto">
        {/* Stage Header: Level, Difficulty Tier, Category, and Prize Value */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs md:text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-amber-300">
              {t.questionNumber} {currentStep.level} {t.of15}
            </span>
            <span>·</span>
            <span className="text-blue-200">{getTierLabel(currentStep.tier)}</span>
            <span>·</span>
            <span className="text-emerald-300 font-medium">{localized.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">{t.currentQuestionValue}:</span>
            <span
              data-testid="current-prize-value"
              className="font-mono-num text-base md:text-lg font-black text-amber-300"
            >
              ${currentStep.formattedAmount}
            </span>
          </div>
        </div>

        {/* Ask the Audience Poll Visualization when triggered */}
        {audiencePoll && (
          <div
            data-testid="audience-poll-panel"
            className="millionaire-hex-box rounded-2xl p-4 bg-slate-950/95"
          >
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-300 mb-3">
              <BarChart3 className="w-4 h-4" />
              <span>{t.audiencePollTitle}</span>
            </div>
            <div className="grid grid-cols-4 gap-3 items-end h-28 pt-2 px-2">
              {audiencePoll.map((pct, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end gap-1">
                  <span className="font-mono-num text-xs font-bold text-amber-200">
                    {pct}%
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-900 rounded-t-md h-16 flex items-end overflow-hidden border border-slate-800">
                    <div
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-300 transition-all duration-300"
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-white">
                    {t.optionLetters[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Authentic Hexagonal Question Chamber */}
        <div className="relative py-2">
          {/* Decorative Studio Horizontal Wing Lines */}
          <div
            className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 millionaire-hex-box rounded-2xl px-6 py-6 md:px-10 md:py-8 text-center">
            <div className="text-xs font-bold text-cyan-300 mb-2">
              {t.activeTurn}: <span className="text-white">{activeTeamName}</span>
            </div>
            <h2
              data-testid="question-text"
              className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {localized.question}
            </h2>
          </div>
        </div>

        {/* 4 Hexagonal Option Chambers (A, B, C, D) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {localized.options.map((optionText, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isPreviousWrong = wrongAttemptOption === idx;
            const isSelected = selectedOption === idx;
            const isCorrect = question.correctIndex === idx;

            let optionStateClass = 'millionaire-option-default text-slate-100';
            if (phase === 'revealed') {
              if (isCorrect) {
                optionStateClass = 'millionaire-option-correct font-black';
              } else if (isSelected || isPreviousWrong) {
                optionStateClass = 'millionaire-option-wrong font-bold';
              }
            } else if (isPreviousWrong) {
              optionStateClass = 'millionaire-option-wrong opacity-60';
            } else if (isSelected) {
              optionStateClass = 'millionaire-option-selected font-extrabold';
            }

            const isDisabled =
              phase !== 'answering' || isEliminated || isPreviousWrong;

            return (
              <button
                key={idx}
                type="button"
                data-testid={`option-btn-${idx}`}
                disabled={isDisabled}
                onClick={() => onSelectOption(idx)}
                className={`w-full rounded-xl px-5 py-4 text-start flex items-center justify-between gap-3 ${optionStateClass} ${
                  isEliminated ? 'opacity-25 cursor-not-allowed' : isDisabled ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono-num text-sm md:text-base font-black shrink-0 ${
                      isSelected && phase !== 'revealed'
                        ? 'text-slate-950'
                        : phase === 'revealed' && isCorrect
                        ? 'text-slate-950'
                        : 'text-amber-400'
                    }`}
                  >
                    ◆ {t.optionLetters[idx]}:
                  </span>
                  <span className="text-base md:text-lg font-bold truncate">
                    {isEliminated ? '— — —' : optionText}
                  </span>
                </div>

                <span className="text-xs font-mono-num opacity-60 shrink-0">
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar: Lock In Final Answer OR Resolution Banner + Next Question */}
      <div className="min-h-[68px] flex items-center justify-between gap-4 millionaire-hex-box rounded-2xl px-5 py-3">
        {phase === 'answering' && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs md:text-sm text-slate-300">
              {selectedOption !== null
                ? `${t.optionLetters[selectedOption]} — ${localized.options[selectedOption]}`
                : lang === 'ar'
                ? 'اختر إحدى الإجابات الأربع ثم اضغط تثبيت الجواب النهائي'
                : 'Select one of the 4 options above, then lock in your final answer'}
            </span>

            <button
              type="button"
              data-testid="lock-in-btn"
              disabled={selectedOption === null}
              onClick={onLockInAnswer}
              className={`px-6 py-3 rounded-xl font-black text-sm md:text-base flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedOption !== null
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t.lockInAnswer}</span>
            </button>
          </div>
        )}

        {phase === 'locked' && (
          <div className="w-full text-center py-1 text-amber-300 font-bold text-base animate-pulse">
            {lang === 'ar' ? 'جواب نهائي... لنرى النتيجة!' : 'Final Answer Locked In...'}
          </div>
        )}

        {phase === 'revealed' && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div
              data-testid="resolution-banner"
              className={`text-sm md:text-base font-extrabold ${
                resolutionBannerTone === 'correct' || resolutionBannerTone === 'steal'
                  ? 'text-emerald-300'
                  : resolutionBannerTone === 'direct'
                  ? 'text-amber-300'
                  : 'text-rose-300'
              }`}
            >
              {resolutionBannerText}
            </div>

            <button
              type="button"
              data-testid="next-question-btn"
              onClick={onNextQuestion}
              className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm md:text-base flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.45)] cursor-pointer whitespace-nowrap"
            >
              {currentStep.level === 15 ? (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>{t.finishMatchBtn}</span>
                </>
              ) : (
                <>
                  <span>{t.nextQuestionBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
