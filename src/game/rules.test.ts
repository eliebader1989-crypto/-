import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRIZE_LADDER,
  TURN_DURATION_SECONDS,
  getTierForLevel,
  getPrizeForLevel,
  getPrimaryTeamForLevel,
  pickQuestionForTier,
  computeFiftyFiftyEliminations,
  computeAudiencePoll,
  resolveTeamAnswer,
  type QuestionItem,
} from './rules';
import { BUILTIN_QUESTIONS } from './questionBank';

const mockQuestions: QuestionItem[] = [
  {
    id: 'q1_easy',
    tier: 1,
    correctIndex: 2,
    ar: { question: 'س1', options: ['أ', 'ب', 'ج', 'د'], category: 'عام' },
    en: { question: 'Q1', options: ['A', 'B', 'C', 'D'], category: 'General' },
  },
  {
    id: 'q2_easy',
    tier: 1,
    correctIndex: 0,
    ar: { question: 'س2', options: ['أ', 'ب', 'ج', 'د'], category: 'عام' },
    en: { question: 'Q2', options: ['A', 'B', 'C', 'D'], category: 'General' },
  },
  {
    id: 'q3_med',
    tier: 2,
    correctIndex: 1,
    ar: { question: 'س3', options: ['أ', 'ب', 'ج', 'د'], category: 'علوم' },
    en: { question: 'Q3', options: ['A', 'B', 'C', 'D'], category: 'Science' },
  },
  {
    id: 'q4_hard',
    tier: 3,
    correctIndex: 3,
    ar: { question: 'س4', options: ['أ', 'ب', 'ج', 'د'], category: 'تاريخ' },
    en: { question: 'Q4', options: ['A', 'B', 'C', 'D'], category: 'History' },
  },
];

test('15-step prize ladder scales from 100 to 1,000,000 across 3 difficulty tiers and turn timer is 60s', () => {
  assert.equal(TURN_DURATION_SECONDS, 60);
  assert.equal(PRIZE_LADDER.length, 15);
  assert.equal(getPrizeForLevel(1).amount, 100);
  assert.equal(getPrizeForLevel(5).amount, 1000);
  assert.equal(getPrizeForLevel(10).amount, 32000);
  assert.equal(getPrizeForLevel(15).amount, 1000000);

  assert.equal(getTierForLevel(1), 1);
  assert.equal(getTierForLevel(5), 1);
  assert.equal(getTierForLevel(6), 2);
  assert.equal(getTierForLevel(10), 2);
  assert.equal(getTierForLevel(11), 3);
  assert.equal(getTierForLevel(15), 3);
});

test('turn alternation alternates primary team on each level', () => {
  assert.equal(getPrimaryTeamForLevel(1, 'A'), 'A');
  assert.equal(getPrimaryTeamForLevel(2, 'A'), 'B');
  assert.equal(getPrimaryTeamForLevel(3, 'A'), 'A');
  assert.equal(getPrimaryTeamForLevel(15, 'A'), 'A');
});

test('pickQuestionForTier avoids used IDs and gracefully resets pool when exhausted', () => {
  const used = new Set<string>(['q1_easy']);
  const firstPick = pickQuestionForTier(mockQuestions, 1, used, undefined, () => 0);
  assert.equal(firstPick.question.id, 'q2_easy');
  assert.equal(firstPick.didResetTierPool, false);

  used.add('q2_easy');
  const exhaustedPick = pickQuestionForTier(mockQuestions, 1, used, 'q2_easy', () => 0);
  assert.equal(exhaustedPick.question.id, 'q1_easy');
  assert.equal(exhaustedPick.didResetTierPool, true);
});

test('50:50 lifeline removes exactly 2 incorrect options and never removes the correct answer', () => {
  const eliminated = computeFiftyFiftyEliminations(2, [], () => 0.5);
  assert.equal(eliminated.length, 2);
  assert.equal(eliminated.includes(2), false);

  // If 1 wrong option was already eliminated during a steal, 50:50 only eliminates 1 more so 2 choices remain
  const stealEliminated = computeFiftyFiftyEliminations(2, [0], () => 0.5);
  assert.equal(stealEliminated.length, 2);
  assert.equal(stealEliminated.includes(0), true);
  assert.equal(stealEliminated.includes(2), false);
});

test('Ask the Audience sums to 100% and sets eliminated options to 0%', () => {
  const poll = computeAudiencePoll(1, 1, [0, 3], () => 0.4);
  assert.equal(poll[0], 0);
  assert.equal(poll[3], 0);
  assert.equal(poll[0] + poll[1] + poll[2] + poll[3], 100);
  assert.ok(poll[1] >= 68);
});

test('Steal Mechanic resolves steal_answer and direct_award accurately', () => {
  // 1. Primary team wrong in steal_answer mode -> passes to Team B
  const stealTrigger = resolveTeamAnswer({
    level: 4,
    prizeAmount: 500,
    activeTeam: 'A',
    isStealAttempt: false,
    stealRuleMode: 'steal_answer',
    selectedOptionIndex: 1,
    correctOptionIndex: 3,
  });
  assert.equal(stealTrigger.type, 'TRIGGER_STEAL_CHANCE');
  if (stealTrigger.type === 'TRIGGER_STEAL_CHANCE') {
    assert.equal(stealTrigger.nextActiveTeam, 'B');
    assert.equal(stealTrigger.eliminatedWrongIndex, 1);
    assert.equal(stealTrigger.advanceToNextLevel, false);
  }

  // 2. Opponent answers correctly on steal -> wins the prize and advances
  const stealSuccess = resolveTeamAnswer({
    level: 4,
    prizeAmount: 500,
    activeTeam: 'B',
    isStealAttempt: true,
    stealRuleMode: 'steal_answer',
    selectedOptionIndex: 3,
    correctOptionIndex: 3,
  });
  assert.equal(stealSuccess.type, 'CORRECT_STEAL');
  if (stealSuccess.type === 'CORRECT_STEAL') {
    assert.equal(stealSuccess.awardedTeam, 'B');
    assert.equal(stealSuccess.pointsAwarded, 500);
    assert.equal(stealSuccess.advanceToNextLevel, true);
  }

  // 3. Primary team wrong in direct_award mode -> automatically awards prize to opponent
  const directAward = resolveTeamAnswer({
    level: 6,
    prizeAmount: 2000,
    activeTeam: 'A',
    isStealAttempt: false,
    stealRuleMode: 'direct_award',
    selectedOptionIndex: 0,
    correctOptionIndex: 2,
  });
  assert.equal(directAward.type, 'DIRECT_AWARD_TO_OPPONENT');
  if (directAward.type === 'DIRECT_AWARD_TO_OPPONENT') {
    assert.equal(directAward.awardedTeam, 'B');
    assert.equal(directAward.pointsAwarded, 2000);
    assert.equal(directAward.advanceToNextLevel, true);
  }
});

test('question bank has 60 balanced secular questions with no Muslim or religious terms', () => {
  assert.equal(BUILTIN_QUESTIONS.length, 60);
  assert.equal(BUILTIN_QUESTIONS.filter((q) => q.tier === 1).length, 20);
  assert.equal(BUILTIN_QUESTIONS.filter((q) => q.tier === 2).length, 20);
  assert.equal(BUILTIN_QUESTIONS.filter((q) => q.tier === 3).length, 20);

  const bannedPattern = /muslim|islamic|islam|quran|surah|hijrah|مسلم|إسلام|القرآن|سورة|الهجرة/i;
  for (const q of BUILTIN_QUESTIONS) {
    const combinedText = `${q.ar.question} ${q.ar.category} ${q.ar.options.join(' ')} ${q.en.question} ${q.en.category} ${q.en.options.join(' ')}`;
    assert.equal(
      bannedPattern.test(combinedText),
      false,
      `Question ${q.id} matched excluded pattern: ${combinedText}`
    );
  }
});


