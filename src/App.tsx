/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameShellState,
  Language,
  QuestionItem,
  StealRuleMode,
  StepResult,
  TURN_DURATION_SECONDS,
  TeamId,
  TeamState,
  computeAudiencePoll,
  computeFiftyFiftyEliminations,
  getPrimaryTeamForLevel,
  getPrizeForLevel,
  getTierForLevel,
  pickQuestionForTier,
  resolveTeamAnswer,
} from './game/rules';
import { BUILTIN_QUESTIONS } from './game/questionBank';
import { getText } from './game/translations';
import { soundEngine } from './utils/soundEngine';
import { TitleScreen } from './components/TitleScreen';
import { StudioHUD } from './components/StudioHUD';
import { QuestionStage, QuestionPhase } from './components/QuestionStage';
import { PrizeLadder } from './components/PrizeLadder';
import { CustomQuestionModal } from './components/CustomQuestionModal';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { StatusModals } from './components/StatusModals';

const USED_IDS_STORAGE_KEY = 'millionaire_2team_used_q_ids_v1';
const CUSTOM_QUESTIONS_STORAGE_KEY = 'millionaire_2team_custom_q_v1';

function loadUsedQuestionIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USED_IDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map(String));
      }
    }
  } catch {}
  return new Set();
}

function saveUsedQuestionIds(ids: Set<string>) {
  try {
    localStorage.setItem(USED_IDS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

function loadCustomQuestions(): QuestionItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}
  return [];
}

function saveCustomQuestions(questions: QuestionItem[]) {
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch {}
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shellState, setShellState] = useState<GameShellState>('title');

  // Pre-game setup state
  const [teamAName, setTeamAName] = useState<string>('فريق الصقور');
  const [teamBName, setTeamBName] = useState<string>('فريق النجوم');
  const [stealRuleMode, setStealRuleMode] = useState<StealRuleMode>('steal_answer');

  // Question Bank state
  const [customQuestions, setCustomQuestions] = useState<QuestionItem[]>(() =>
    loadCustomQuestions()
  );
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(() =>
    loadUsedQuestionIds()
  );

  // Modals on Title screen
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Active Match State
  const [teamA, setTeamA] = useState<TeamState>({
    id: 'A',
    name: 'فريق الصقور',
    score: 0,
    correctCount: 0,
    stealCount: 0,
    wrongCount: 0,
    lifelines: { fiftyFifty: true, askAudience: true, switchQuestion: true },
  });
  const [teamB, setTeamB] = useState<TeamState>({
    id: 'B',
    name: 'فريق النجوم',
    score: 0,
    correctCount: 0,
    stealCount: 0,
    wrongCount: 0,
    lifelines: { fiftyFifty: true, askAudience: true, switchQuestion: true },
  });

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [activeTeam, setActiveTeam] = useState<TeamId>('A');
  const [isStealAttempt, setIsStealAttempt] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem>(BUILTIN_QUESTIONS[0]);
  const [questionPhase, setQuestionPhase] = useState<QuestionPhase>('answering');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [wrongAttemptOption, setWrongAttemptOption] = useState<number | null>(null);
  const [audiencePoll, setAudiencePoll] = useState<[number, number, number, number] | null>(null);
  const [stepResults, setStepResults] = useState<Record<number, StepResult>>({});

  const [resolutionBannerText, setResolutionBannerText] = useState<string | null>(null);
  const [resolutionBannerTone, setResolutionBannerTone] = useState<
    'correct' | 'steal' | 'direct' | 'missed' | null
  >(null);

  // 60-second countdown timer per turn
  const [timeLeft, setTimeLeft] = useState<number>(TURN_DURATION_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  const allQuestions = [...BUILTIN_QUESTIONS, ...customQuestions];

  // Mirror game state to document.body.dataset.state
  useEffect(() => {
    document.body.dataset.state = shellState;
  }, [shellState]);

  const markQuestionUsed = useCallback((id: string, resetTier?: 1 | 2 | 3) => {
    setUsedQuestionIds((prev) => {
      const next = new Set(prev);
      if (resetTier) {
        allQuestions
          .filter((q) => q.tier === resetTier)
          .forEach((q) => next.delete(q.id));
      }
      next.add(id);
      saveUsedQuestionIds(next);
      return next;
    });
  }, [allQuestions]);

  const startNewBattle = useCallback(() => {
    const t = getText(lang);
    const cleanNameA = teamAName.trim() || t.defaultTeamA;
    const cleanNameB = teamBName.trim() || t.defaultTeamB;

    setTeamA({
      id: 'A',
      name: cleanNameA,
      score: 0,
      correctCount: 0,
      stealCount: 0,
      wrongCount: 0,
      lifelines: { fiftyFifty: true, askAudience: true, switchQuestion: true },
    });
    setTeamB({
      id: 'B',
      name: cleanNameB,
      score: 0,
      correctCount: 0,
      stealCount: 0,
      wrongCount: 0,
      lifelines: { fiftyFifty: true, askAudience: true, switchQuestion: true },
    });

    const firstPick = pickQuestionForTier(allQuestions, 1, usedQuestionIds);
    markQuestionUsed(
      firstPick.question.id,
      firstPick.didResetTierPool ? 1 : undefined
    );

    setCurrentLevel(1);
    setActiveTeam('A');
    setIsStealAttempt(false);
    setCurrentQuestion(firstPick.question);
    setQuestionPhase('answering');
    setSelectedOption(null);
    setEliminatedOptions([]);
    setWrongAttemptOption(null);
    setAudiencePoll(null);
    setStepResults({});
    setResolutionBannerText(null);
    setResolutionBannerTone(null);
    setTimeLeft(TURN_DURATION_SECONDS);
    setIsTimerPaused(false);
    setShellState('playing');

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    soundEngine.startTensionDrone(1);
  }, [lang, teamAName, teamBName, allQuestions, usedQuestionIds, markQuestionUsed]);

  // Support ?autostart=1
  const didAutoStartRef = useRef(false);
  useEffect(() => {
    if (didAutoStartRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      didAutoStartRef.current = true;
      startNewBattle();
    }
  }, [startNewBattle]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      if (teamAName === 'فريق الصقور' && next === 'en') setTeamAName('Team Falcons');
      if (teamAName === 'Team Falcons' && next === 'ar') setTeamAName('فريق الصقور');
      if (teamBName === 'فريق النجوم' && next === 'en') setTeamBName('Team Titans');
      if (teamBName === 'Team Titans' && next === 'ar') setTeamBName('فريق النجوم');
      return next;
    });
  }, [teamAName, teamBName]);

  const resolveTurnWithSelection = useCallback(
    (chosenIndex: number | null) => {
      const t = getText(lang);
      const step = getPrizeForLevel(currentLevel);
      const outcome = resolveTeamAnswer({
        level: currentLevel,
        prizeAmount: step.amount,
        activeTeam,
        isStealAttempt,
        stealRuleMode,
        selectedOptionIndex: chosenIndex,
        correctOptionIndex: currentQuestion.correctIndex,
      });

      const getTeamName = (id: TeamId) => (id === 'A' ? teamA.name : teamB.name);

      if (outcome.type === 'CORRECT_PRIMARY') {
        soundEngine.stopTensionDrone();
        soundEngine.playCorrectFanfare(currentLevel === 15);
        const winnerSetter = outcome.awardedTeam === 'A' ? setTeamA : setTeamB;
        winnerSetter((prev) => ({
          ...prev,
          score: prev.score + outcome.pointsAwarded,
          correctCount: prev.correctCount + 1,
        }));
        setStepResults((prev) => ({
          ...prev,
          [currentLevel]: {
            level: currentLevel,
            prize: outcome.pointsAwarded,
            winnerTeam: outcome.awardedTeam,
            wasStolen: false,
            wasDirectAward: false,
          },
        }));
        setResolutionBannerText(
          `${t.correctAnnouncement} ${getTeamName(outcome.awardedTeam)} (+$${step.formattedAmount})`
        );
        setResolutionBannerTone('correct');
        setQuestionPhase('revealed');
        return;
      }

      if (outcome.type === 'CORRECT_STEAL') {
        soundEngine.stopTensionDrone();
        soundEngine.playCorrectFanfare(currentLevel === 15);
        const winnerSetter = outcome.awardedTeam === 'A' ? setTeamA : setTeamB;
        winnerSetter((prev) => ({
          ...prev,
          score: prev.score + outcome.pointsAwarded,
          correctCount: prev.correctCount + 1,
          stealCount: prev.stealCount + 1,
        }));
        setStepResults((prev) => ({
          ...prev,
          [currentLevel]: {
            level: currentLevel,
            prize: outcome.pointsAwarded,
            winnerTeam: outcome.awardedTeam,
            wasStolen: true,
            wasDirectAward: false,
          },
        }));
        setResolutionBannerText(
          `${t.stealSuccessAnnouncement} ${getTeamName(outcome.awardedTeam)} (+$${step.formattedAmount})`
        );
        setResolutionBannerTone('steal');
        setQuestionPhase('revealed');
        return;
      }

      if (outcome.type === 'TRIGGER_STEAL_CHANCE') {
        soundEngine.playWrongBuzzer();
        setTimeout(() => soundEngine.playStealAlert(), 360);
        const missSetter = activeTeam === 'A' ? setTeamA : setTeamB;
        missSetter((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));

        if (outcome.eliminatedWrongIndex !== null) {
          setWrongAttemptOption(outcome.eliminatedWrongIndex);
        }
        setActiveTeam(outcome.nextActiveTeam);
        setIsStealAttempt(true);
        setSelectedOption(null);
        setQuestionPhase('answering');
        setTimeLeft(TURN_DURATION_SECONDS);
        setIsTimerPaused(false);
        return;
      }

      if (outcome.type === 'DIRECT_AWARD_TO_OPPONENT') {
        soundEngine.stopTensionDrone();
        soundEngine.playWrongBuzzer();
        const missSetter = activeTeam === 'A' ? setTeamA : setTeamB;
        missSetter((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));

        const awardSetter = outcome.awardedTeam === 'A' ? setTeamA : setTeamB;
        awardSetter((prev) => ({
          ...prev,
          score: prev.score + outcome.pointsAwarded,
          stealCount: prev.stealCount + 1,
        }));
        setStepResults((prev) => ({
          ...prev,
          [currentLevel]: {
            level: currentLevel,
            prize: outcome.pointsAwarded,
            winnerTeam: outcome.awardedTeam,
            wasStolen: true,
            wasDirectAward: true,
          },
        }));
        setResolutionBannerText(
          `${t.directAwardAnnouncement} ${getTeamName(outcome.awardedTeam)} (+$${step.formattedAmount})`
        );
        setResolutionBannerTone('direct');
        setQuestionPhase('revealed');
        return;
      }

      // BOTH_TEAMS_MISSED
      soundEngine.stopTensionDrone();
      soundEngine.playWrongBuzzer();
      const missSetter = activeTeam === 'A' ? setTeamA : setTeamB;
      missSetter((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));
      setStepResults((prev) => ({
        ...prev,
        [currentLevel]: {
          level: currentLevel,
          prize: step.amount,
          winnerTeam: null,
          wasStolen: false,
          wasDirectAward: false,
        },
      }));
      setResolutionBannerText(t.bothMissedAnnouncement);
      setResolutionBannerTone('missed');
      setQuestionPhase('revealed');
    },
    [
      lang,
      currentLevel,
      activeTeam,
      isStealAttempt,
      stealRuleMode,
      currentQuestion.correctIndex,
      teamA.name,
      teamB.name,
    ]
  );

  const handleLockInAnswer = useCallback(() => {
    if (questionPhase !== 'answering' || selectedOption === null) return;
    soundEngine.playLockInSuspense();
    setQuestionPhase('locked');
    const lockedChoice = selectedOption;
    setTimeout(() => {
      resolveTurnWithSelection(lockedChoice);
    }, 350);
  }, [questionPhase, selectedOption, resolveTurnWithSelection]);

  const handleNextQuestion = useCallback(() => {
    if (currentLevel >= 15) {
      soundEngine.stopTensionDrone();
      soundEngine.playCorrectFanfare(true);
      setShellState('gameover');
      return;
    }

    const nextLevel = currentLevel + 1;
    const nextTier = getTierForLevel(nextLevel);
    const nextPrimaryTeam = getPrimaryTeamForLevel(nextLevel, 'A');
    const picked = pickQuestionForTier(
      allQuestions,
      nextTier,
      usedQuestionIds,
      currentQuestion.id
    );

    markQuestionUsed(
      picked.question.id,
      picked.didResetTierPool ? nextTier : undefined
    );

    setCurrentLevel(nextLevel);
    setActiveTeam(nextPrimaryTeam);
    setIsStealAttempt(false);
    setCurrentQuestion(picked.question);
    setQuestionPhase('answering');
    setSelectedOption(null);
    setEliminatedOptions([]);
    setWrongAttemptOption(null);
    setAudiencePoll(null);
    setResolutionBannerText(null);
    setResolutionBannerTone(null);
    setTimeLeft(TURN_DURATION_SECONDS);
    setIsTimerPaused(false);
    soundEngine.startTensionDrone(nextTier);
  }, [currentLevel, allQuestions, usedQuestionIds, currentQuestion.id, markQuestionUsed]);

  // 30-second countdown interval
  useEffect(() => {
    if (
      shellState !== 'playing' ||
      questionPhase !== 'answering' ||
      isTimerPaused
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resolveTurnWithSelection(null);
          return 0;
        }
        const nextVal = prev - 1;
        if (nextVal <= 10) {
          soundEngine.playTimerTick(nextVal <= 5);
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shellState, questionPhase, isTimerPaused, resolveTurnWithSelection]);

  // Lifeline 1: 50:50
  const handleUseFiftyFifty = useCallback(
    (teamId: TeamId) => {
      if (teamId !== activeTeam || questionPhase !== 'answering') return;
      const targetTeam = teamId === 'A' ? teamA : teamB;
      if (!targetTeam.lifelines.fiftyFifty) return;

      soundEngine.playLifelineActivate();
      const alreadyInvalid = [
        ...eliminatedOptions,
        ...(wrongAttemptOption !== null ? [wrongAttemptOption] : []),
      ];
      const nextEliminated = computeFiftyFiftyEliminations(
        currentQuestion.correctIndex,
        alreadyInvalid
      );
      setEliminatedOptions(nextEliminated);
      if (selectedOption !== null && nextEliminated.includes(selectedOption)) {
        setSelectedOption(null);
      }

      const setter = teamId === 'A' ? setTeamA : setTeamB;
      setter((prev) => ({
        ...prev,
        lifelines: { ...prev.lifelines, fiftyFifty: false },
      }));
    },
    [
      activeTeam,
      questionPhase,
      teamA,
      teamB,
      eliminatedOptions,
      wrongAttemptOption,
      currentQuestion.correctIndex,
      selectedOption,
    ]
  );

  // Lifeline 2: Ask the Audience
  const handleUseAskAudience = useCallback(
    (teamId: TeamId) => {
      if (teamId !== activeTeam || questionPhase !== 'answering') return;
      const targetTeam = teamId === 'A' ? teamA : teamB;
      if (!targetTeam.lifelines.askAudience) return;

      soundEngine.playLifelineActivate();
      const invalidIndices = [
        ...eliminatedOptions,
        ...(wrongAttemptOption !== null ? [wrongAttemptOption] : []),
      ];
      const poll = computeAudiencePoll(
        currentQuestion.correctIndex,
        currentQuestion.tier,
        invalidIndices
      );
      setAudiencePoll(poll);

      const setter = teamId === 'A' ? setTeamA : setTeamB;
      setter((prev) => ({
        ...prev,
        lifelines: { ...prev.lifelines, askAudience: false },
      }));
    },
    [
      activeTeam,
      questionPhase,
      teamA,
      teamB,
      eliminatedOptions,
      wrongAttemptOption,
      currentQuestion.correctIndex,
      currentQuestion.tier,
    ]
  );

  // Lifeline 3: Switch the Question
  const handleUseSwitchQuestion = useCallback(
    (teamId: TeamId) => {
      if (teamId !== activeTeam || questionPhase !== 'answering') return;
      const targetTeam = teamId === 'A' ? teamA : teamB;
      if (!targetTeam.lifelines.switchQuestion) return;

      soundEngine.playLifelineActivate();
      const tier = getTierForLevel(currentLevel);
      const picked = pickQuestionForTier(
        allQuestions,
        tier,
        usedQuestionIds,
        currentQuestion.id
      );
      markQuestionUsed(
        picked.question.id,
        picked.didResetTierPool ? tier : undefined
      );

      setCurrentQuestion(picked.question);
      setSelectedOption(null);
      setEliminatedOptions([]);
      setWrongAttemptOption(null);
      setAudiencePoll(null);
      setTimeLeft(TURN_DURATION_SECONDS);

      const setter = teamId === 'A' ? setTeamA : setTeamB;
      setter((prev) => ({
        ...prev,
        lifelines: { ...prev.lifelines, switchQuestion: false },
      }));
    },
    [
      activeTeam,
      questionPhase,
      teamA,
      teamB,
      currentLevel,
      allQuestions,
      usedQuestionIds,
      currentQuestion.id,
      markQuestionUsed,
    ]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isInputFocused) return;

      if (shellState === 'title') {
        if ((e.key === 'Enter' || e.key === ' ') && !isCustomModalOpen && !isAiModalOpen) {
          e.preventDefault();
          startNewBattle();
        }
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (e.key.toLowerCase() === 'p' || e.key === 'Escape') {
        e.preventDefault();
        if (shellState === 'playing') {
          soundEngine.stopTensionDrone();
          setShellState('paused');
        } else if (shellState === 'paused') {
          soundEngine.startTensionDrone(getTierForLevel(currentLevel));
          setShellState('playing');
        }
        return;
      }

      if (shellState === 'playing') {
        if (['1', '2', '3', '4'].includes(e.key) && questionPhase === 'answering') {
          const idx = Number(e.key) - 1;
          if (!eliminatedOptions.includes(idx) && wrongAttemptOption !== idx) {
            setSelectedOption(idx);
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (questionPhase === 'answering' && selectedOption !== null) {
            handleLockInAnswer();
          } else if (questionPhase === 'revealed') {
            handleNextQuestion();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    shellState,
    isCustomModalOpen,
    isAiModalOpen,
    startNewBattle,
    handleToggleMute,
    currentLevel,
    questionPhase,
    eliminatedOptions,
    wrongAttemptOption,
    selectedOption,
    handleLockInAnswer,
    handleNextQuestion,
  ]);

  const handleResetUsedQuestions = () => {
    const empty = new Set<string>();
    setUsedQuestionIds(empty);
    saveUsedQuestionIds(empty);
  };

  const handleAddCustomQuestion = (q: QuestionItem) => {
    setCustomQuestions((prev) => {
      const next = [...prev, q];
      saveCustomQuestions(next);
      return next;
    });
  };

  const handleAddAiQuestions = (questions: QuestionItem[]) => {
    setCustomQuestions((prev) => {
      const next = [...prev, ...questions];
      saveCustomQuestions(next);
      return next;
    });
  };

  const unusedQuestionsCount = allQuestions.filter(
    (q) => !usedQuestionIds.has(q.id)
  ).length;

  const isRtl = lang === 'ar';
  const currentStep = getPrizeForLevel(currentLevel);

  return (
    <>
      {shellState === 'title' ? (
        <TitleScreen
          lang={lang}
          onToggleLang={handleToggleLang}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          teamAName={teamAName}
          setTeamAName={setTeamAName}
          teamBName={teamBName}
          setTeamBName={setTeamBName}
          stealRuleMode={stealRuleMode}
          setStealRuleMode={setStealRuleMode}
          totalQuestionsCount={allQuestions.length}
          unusedQuestionsCount={unusedQuestionsCount}
          customQuestionsCount={customQuestions.length}
          onResetUsedQuestions={handleResetUsedQuestions}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          onStartGame={startNewBattle}
        />
      ) : (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`min-h-screen w-full studio-arena-bg text-slate-100 flex flex-col justify-between p-3 md:p-5 gap-3 ${
            isRtl ? 'font-studio-ar' : 'font-studio-en'
          }`}
        >
          {/* Top Studio HUD: Both Teams, Scoreboard, Lifelines, 30s Timer & Steal Banner */}
          <StudioHUD
            lang={lang}
            onToggleLang={handleToggleLang}
            teamA={teamA}
            teamB={teamB}
            activeTeam={activeTeam}
            isStealAttempt={isStealAttempt}
            timeLeft={timeLeft}
            isTimerPaused={isTimerPaused}
            onToggleTimerPause={() => setIsTimerPaused((prev) => !prev)}
            onResetTimer={() => setTimeLeft(TURN_DURATION_SECONDS)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenPauseModal={() => {
              soundEngine.stopTensionDrone();
              setShellState('paused');
            }}
            onRestartMatch={startNewBattle}
            canUseLifelines={questionPhase === 'answering'}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseAskAudience={handleUseAskAudience}
            onUseSwitchQuestion={handleUseSwitchQuestion}
          />

          {/* Main Studio Arena Grid: Question Stage (8 cols) + 15-Step Money Tree (4 cols) */}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch max-w-[1400px] w-full mx-auto">
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
              <QuestionStage
                lang={lang}
                question={currentQuestion}
                currentStep={currentStep}
                activeTeam={activeTeam}
                activeTeamName={activeTeam === 'A' ? teamA.name : teamB.name}
                phase={questionPhase}
                selectedOption={selectedOption}
                eliminatedOptions={eliminatedOptions}
                wrongAttemptOption={wrongAttemptOption}
                audiencePoll={audiencePoll}
                resolutionBannerText={resolutionBannerText}
                resolutionBannerTone={resolutionBannerTone}
                onSelectOption={(idx) => setSelectedOption(idx)}
                onLockInAnswer={handleLockInAnswer}
                onNextQuestion={handleNextQuestion}
              />
            </div>

            <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
              <PrizeLadder
                lang={lang}
                currentLevel={currentLevel}
                stepResults={stepResults}
                teamAName={teamA.name}
                teamBName={teamB.name}
              />
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      <CustomQuestionModal
        lang={lang}
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddQuestion={handleAddCustomQuestion}
      />

      <AiGeneratorModal
        lang={lang}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddQuestions={handleAddAiQuestions}
      />

      <StatusModals
        lang={lang}
        shellState={shellState}
        teamA={teamA}
        teamB={teamB}
        onResume={() => {
          soundEngine.startTensionDrone(getTierForLevel(currentLevel));
          setShellState('playing');
        }}
        onRestart={startNewBattle}
        onReturnTitle={() => {
          soundEngine.stopTensionDrone();
          setShellState('title');
        }}
      />
    </>
  );
}
