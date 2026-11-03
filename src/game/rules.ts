export type DifficultyTier = 1 | 2 | 3;
export type Language = 'ar' | 'en';
export type TeamId = 'A' | 'B';
export type StealRuleMode = 'steal_answer' | 'direct_award';
export type GameShellState = 'title' | 'playing' | 'paused' | 'gameover';

export const TURN_DURATION_SECONDS = 60;

export interface LocalizedQuestionContent {
  question: string;
  options: [string, string, string, string];
  category: string;
}

export interface QuestionItem {
  id: string;
  tier: DifficultyTier;
  correctIndex: number; // 0, 1, 2, 3
  ar: LocalizedQuestionContent;
  en: LocalizedQuestionContent;
  isCustom?: boolean;
}

export interface TeamLifelines {
  fiftyFifty: boolean;
  askAudience: boolean;
  switchQuestion: boolean;
}

export interface TeamState {
  id: TeamId;
  name: string;
  score: number;
  correctCount: number;
  stealCount: number;
  wrongCount: number;
  lifelines: TeamLifelines;
}

export interface StepResult {
  level: number; // 1..15
  prize: number;
  winnerTeam: TeamId | null;
  wasStolen: boolean;
  wasDirectAward: boolean;
}

export interface PrizeStep {
  level: number; // 1 to 15
  amount: number;
  formattedAmount: string;
  tier: DifficultyTier;
  isMilestone: boolean;
}

export const PRIZE_LADDER: PrizeStep[] = [
  { level: 1, amount: 100, formattedAmount: '100', tier: 1, isMilestone: false },
  { level: 2, amount: 200, formattedAmount: '200', tier: 1, isMilestone: false },
  { level: 3, amount: 300, formattedAmount: '300', tier: 1, isMilestone: false },
  { level: 4, amount: 500, formattedAmount: '500', tier: 1, isMilestone: false },
  { level: 5, amount: 1000, formattedAmount: '1,000', tier: 1, isMilestone: true },
  { level: 6, amount: 2000, formattedAmount: '2,000', tier: 2, isMilestone: false },
  { level: 7, amount: 4000, formattedAmount: '4,000', tier: 2, isMilestone: false },
  { level: 8, amount: 8000, formattedAmount: '8,000', tier: 2, isMilestone: false },
  { level: 9, amount: 16000, formattedAmount: '16,000', tier: 2, isMilestone: false },
  { level: 10, amount: 32000, formattedAmount: '32,000', tier: 2, isMilestone: true },
  { level: 11, amount: 64000, formattedAmount: '64,000', tier: 3, isMilestone: false },
  { level: 12, amount: 125000, formattedAmount: '125,000', tier: 3, isMilestone: false },
  { level: 13, amount: 250000, formattedAmount: '250,000', tier: 3, isMilestone: false },
  { level: 14, amount: 500000, formattedAmount: '500,000', tier: 3, isMilestone: false },
  { level: 15, amount: 1000000, formattedAmount: '1,000,000', tier: 3, isMilestone: true },
];

export function getTierForLevel(level: number): DifficultyTier {
  if (level <= 5) return 1;
  if (level <= 10) return 2;
  return 3;
}

export function getPrizeForLevel(level: number): PrizeStep {
  const step = PRIZE_LADDER.find((s) => s.level === level);
  return step ?? PRIZE_LADDER[0];
}

export function getOpponentTeam(team: TeamId): TeamId {
  return team === 'A' ? 'B' : 'A';
}

export function getPrimaryTeamForLevel(level: number, startingTeam: TeamId = 'A'): TeamId {
  // Odd levels -> startingTeam, Even levels -> opponent
  return level % 2 === 1 ? startingTeam : getOpponentTeam(startingTeam);
}

/**
 * Selects an unused question strictly from the required difficulty tier.
 * If all questions in that tier have been used, resets only that tier's pool so the game never crashes.
 */
export function pickQuestionForTier(
  allQuestions: QuestionItem[],
  tier: DifficultyTier,
  usedIds: Set<string>,
  excludeCurrentId?: string,
  randomFn: () => number = Math.random
): { question: QuestionItem; didResetTierPool: boolean } {
  const tierPool = allQuestions.filter((q) => q.tier === tier);
  if (tierPool.length === 0) {
    throw new Error(`No questions available for tier ${tier}`);
  }

  let available = tierPool.filter(
    (q) => !usedIds.has(q.id) && q.id !== excludeCurrentId
  );
  let didResetTierPool = false;

  if (available.length === 0) {
    didResetTierPool = true;
    available = tierPool.filter((q) => q.id !== excludeCurrentId);
    if (available.length === 0) {
      available = tierPool;
    }
  }

  const index = Math.floor(randomFn() * available.length);
  return {
    question: available[Math.min(index, available.length - 1)],
    didResetTierPool,
  };
}

/**
 * Computes two incorrect option indices to eliminate for the 50:50 lifeline.
 * Respects any already eliminated options (e.g., if used during a steal attempt).
 */
export function computeFiftyFiftyEliminations(
  correctIndex: number,
  alreadyEliminated: number[] = [],
  randomFn: () => number = Math.random
): number[] {
  const wrongIndices = [0, 1, 2, 3].filter(
    (idx) => idx !== correctIndex && !alreadyEliminated.includes(idx)
  );

  // Shuffle wrongIndices using Fisher-Yates
  const shuffled = [...wrongIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Eliminate up to 2 wrong options so only 1 wrong option remains alongside the correct option
  const countToEliminate = Math.min(2, Math.max(0, wrongIndices.length - 1));
  return [...alreadyEliminated, ...shuffled.slice(0, countToEliminate)].sort((a, b) => a - b);
}

/**
 * Generates realistic Ask the Audience percentages that sum to 100%,
 * zeroing out any eliminated options and weighting the correct answer by tier.
 */
export function computeAudiencePoll(
  correctIndex: number,
  tier: DifficultyTier,
  eliminatedIndices: number[] = [],
  randomFn: () => number = Math.random
): [number, number, number, number] {
  const activeIndices = [0, 1, 2, 3].filter((idx) => !eliminatedIndices.includes(idx));
  const result: [number, number, number, number] = [0, 0, 0, 0];

  if (activeIndices.length === 0) {
    return [25, 25, 25, 25];
  }

  // Base confidence for the audience based on difficulty tier
  const baseCorrectShare =
    tier === 1
      ? 68 + Math.floor(randomFn() * 16) // 68% - 83% on Easy
      : tier === 2
      ? 52 + Math.floor(randomFn() * 16) // 52% - 67% on Medium
      : 42 + Math.floor(randomFn() * 16); // 42% - 57% on Hard

  result[correctIndex] = baseCorrectShare;
  let remaining = 100 - baseCorrectShare;

  const wrongActive = activeIndices.filter((idx) => idx !== correctIndex);
  if (wrongActive.length === 0) {
    result[correctIndex] = 100;
    return result;
  }

  wrongActive.forEach((idx, pos) => {
    if (pos === wrongActive.length - 1) {
      result[idx] = remaining;
    } else {
      const share = Math.floor(randomFn() * (remaining + 1));
      result[idx] = share;
      remaining -= share;
    }
  });

  return result;
}

export interface AnswerResolutionInput {
  level: number;
  prizeAmount: number;
  activeTeam: TeamId;
  isStealAttempt: boolean;
  stealRuleMode: StealRuleMode;
  selectedOptionIndex: number | null; // null means timer expired
  correctOptionIndex: number;
}

export type AnswerResolutionOutcome =
  | {
      type: 'CORRECT_PRIMARY';
      awardedTeam: TeamId;
      pointsAwarded: number;
      advanceToNextLevel: true;
    }
  | {
      type: 'CORRECT_STEAL';
      awardedTeam: TeamId;
      pointsAwarded: number;
      advanceToNextLevel: true;
    }
  | {
      type: 'TRIGGER_STEAL_CHANCE';
      nextActiveTeam: TeamId;
      eliminatedWrongIndex: number | null;
      advanceToNextLevel: false;
    }
  | {
      type: 'DIRECT_AWARD_TO_OPPONENT';
      awardedTeam: TeamId;
      pointsAwarded: number;
      advanceToNextLevel: true;
    }
  | {
      type: 'BOTH_TEAMS_MISSED';
      awardedTeam: null;
      pointsAwarded: 0;
      advanceToNextLevel: true;
    };

/**
 * Pure state machine resolver for answering or timing out on a question in 2-Team Battle mode.
 */
export function resolveTeamAnswer(input: AnswerResolutionInput): AnswerResolutionOutcome {
  const {
    prizeAmount,
    activeTeam,
    isStealAttempt,
    stealRuleMode,
    selectedOptionIndex,
    correctOptionIndex,
  } = input;

  const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === correctOptionIndex;

  if (isCorrect) {
    return {
      type: isStealAttempt ? 'CORRECT_STEAL' : 'CORRECT_PRIMARY',
      awardedTeam: activeTeam,
      pointsAwarded: prizeAmount,
      advanceToNextLevel: true,
    };
  }

  // Wrong answer or timeout:
  if (!isStealAttempt) {
    const opponent = getOpponentTeam(activeTeam);
    if (stealRuleMode === 'direct_award') {
      return {
        type: 'DIRECT_AWARD_TO_OPPONENT',
        awardedTeam: opponent,
        pointsAwarded: prizeAmount,
        advanceToNextLevel: true,
      };
    }

    return {
      type: 'TRIGGER_STEAL_CHANCE',
      nextActiveTeam: opponent,
      eliminatedWrongIndex: selectedOptionIndex,
      advanceToNextLevel: false,
    };
  }

  // Opponent also missed during their steal attempt
  return {
    type: 'BOTH_TEAMS_MISSED',
    awardedTeam: null,
    pointsAwarded: 0,
    advanceToNextLevel: true,
  };
}
