import { useState, useCallback } from "react";

interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  shuffled: string[];
}

export type RandomEvent = "double_points" | "lightning" | "bonus_question" | null;

interface TriviaState {
  questions: TriviaQuestion[];
  currentIndex: number;
  score: number;
  selectedAnswer: string | null;
  loading: boolean;
  gameOver: boolean;
  highScore: number;
  isNewHighScore: boolean;
  totalScore: number;
  leveledUp: boolean;
  newLevelName: string;
  questionStartTime: number;
  lastBonus: number;
  usedFiftyFifty: boolean;
  usedSkip: boolean;
  hiddenAnswers: string[];
  activeEvent: RandomEvent;
  showingEvent: boolean;
  batchCorrect: number;
  batchIndex: number; // which question within current batch (0-4)
  round: number; // which batch we're on (1-based)
  fetchingMore: boolean;
}

export const TIMER_SECONDS = 10;
const LIGHTNING_SECONDS = 5;
const BATCH_SIZE = 5;
const PASS_THRESHOLD = 3;
const BASE_POINTS = 10;
const MAX_BONUS = 10;
const BONUS_QUESTION_EXTRA = 15;
const EVENT_CHANCE = 0.2;
const HIGH_SCORE_KEY = "trivia-high-score";
const TOTAL_SCORE_KEY = "trivia-total-score";

// Weighted events: double_points is less frequent
const WEIGHTED_EVENTS: { event: RandomEvent; weight: number }[] = [
  { event: "double_points", weight: 1 },
  { event: "lightning", weight: 3 },
  { event: "bonus_question", weight: 3 },
];

export const EVENT_INFO: Record<Exclude<RandomEvent, null>, { title: string; subtitle: string; color: string }> = {
  double_points: { title: "DOUBLE POINTS", subtitle: "THIS QUESTION IS WORTH 2×!", color: "text-primary" },
  lightning: { title: "⚡ LIGHTNING ⚡", subtitle: "YOU ONLY HAVE 5 SECONDS!", color: "text-destructive" },
  bonus_question: { title: "★ BONUS ★", subtitle: "EXTRA 15 PTS IF CORRECT!", color: "text-secondary" },
};

const LEVELS = [
  { threshold: 0, name: "ROOKIE" },
  { threshold: 30, name: "PLAYER" },
  { threshold: 80, name: "ARCADE PRO" },
  { threshold: 150, name: "TRIVIA MASTER" },
  { threshold: 250, name: "ARCADE LEGEND" },
];

export function getLevel(totalScore: number) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (totalScore >= l.threshold) level = l;
  }
  return level;
}

export function getNextLevel(totalScore: number) {
  for (const l of LEVELS) {
    if (totalScore < l.threshold) return l;
  }
  return null;
}

function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function getTotalScore(): number {
  const stored = localStorage.getItem(TOTAL_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function saveHighScore(score: number) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
    return true;
  }
  return false;
}

function addToTotalScore(score: number) {
  const oldTotal = getTotalScore();
  const newTotal = oldTotal + score;
  localStorage.setItem(TOTAL_SCORE_KEY, String(newTotal));
  const oldLvl = getLevel(oldTotal).name;
  const newLvl = getLevel(newTotal).name;
  return { newTotal, leveledUp: oldLvl !== newLvl, oldLevel: oldLvl, newLevel: newLvl };
}

function shuffleArray(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rollEvent(round: number): RandomEvent {
  // No events in the first round
  if (round <= 1) return null;
  if (Math.random() < EVENT_CHANCE) {
    const totalWeight = WEIGHTED_EVENTS.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * totalWeight;
    for (const we of WEIGHTED_EVENTS) {
      r -= we.weight;
      if (r <= 0) return we.event;
    }
    return WEIGHTED_EVENTS[WEIGHTED_EVENTS.length - 1].event;
  }
  return null;
}

export function getTimerSeconds(event: RandomEvent): number {
  return event === "lightning" ? LIGHTNING_SECONDS : TIMER_SECONDS;
}

function calcBonus(startTime: number, event: RandomEvent): number {
  const timerLen = getTimerSeconds(event);
  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = Math.max(0, timerLen - elapsed);
  return Math.round((remaining / timerLen) * MAX_BONUS);
}

async function fetchBatch(): Promise<TriviaQuestion[]> {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${BATCH_SIZE}&type=multiple`
  );
  const data = await res.json();
  return data.results.map((q: any) => ({
    ...q,
    shuffled: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
  }));
}

const initialState = (): TriviaState => ({
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedAnswer: null,
  loading: true,
  gameOver: false,
  highScore: getHighScore(),
  isNewHighScore: false,
  totalScore: getTotalScore(),
  leveledUp: false,
  newLevelName: "",
  questionStartTime: Date.now(),
  lastBonus: 0,
  usedFiftyFifty: false,
  usedSkip: false,
  hiddenAnswers: [],
  activeEvent: null,
  showingEvent: false,
  batchCorrect: 0,
  batchIndex: 0,
  round: 1,
  fetchingMore: false,
});

export function useTrivia() {
  const [state, setState] = useState<TriviaState>(initialState);

  const fetchQuestions = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const questions = await fetchBatch();
      const event = rollEvent(1);
      setState({
        ...initialState(),
        questions,
        loading: false,
        questionStartTime: Date.now(),
        highScore: getHighScore(),
        totalScore: getTotalScore(),
        activeEvent: event,
        showingEvent: !!event,
      });
    } catch {
      setState(s => ({ ...s, loading: false }));
    }
  }, []);

  const dismissEvent = useCallback(() => {
    setState(s => ({ ...s, showingEvent: false, questionStartTime: Date.now() }));
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    setState(s => {
      if (s.selectedAnswer) return s;
      const isCorrect = answer === s.questions[s.currentIndex].correct_answer;
      const bonus = isCorrect ? calcBonus(s.questionStartTime, s.activeEvent) : 0;
      let points = isCorrect ? BASE_POINTS + bonus : 0;

      if (isCorrect && s.activeEvent === "double_points") {
        points *= 2;
      } else if (isCorrect && s.activeEvent === "bonus_question") {
        points += BONUS_QUESTION_EXTRA;
      }

      return {
        ...s,
        selectedAnswer: answer,
        score: s.score + points,
        lastBonus: isCorrect ? bonus : 0,
        batchCorrect: s.batchCorrect + (isCorrect ? 1 : 0),
      };
    });
  }, []);

  const timeUp = useCallback(() => {
    setState(s => {
      if (s.selectedAnswer) return s;
      return { ...s, selectedAnswer: "__TIME_UP__", lastBonus: 0 };
    });
  }, []);

  const endGame = (s: TriviaState): TriviaState => {
    const isNew = saveHighScore(s.score);
    const result = addToTotalScore(s.score);
    return {
      ...s,
      gameOver: true,
      selectedAnswer: null,
      isNewHighScore: isNew,
      highScore: Math.max(s.highScore, s.score),
      totalScore: result.newTotal,
      leveledUp: result.leveledUp,
      newLevelName: result.newLevel,
      activeEvent: null,
      showingEvent: false,
    };
  };

  const loadNextBatch = useCallback(async () => {
    setState(s => ({ ...s, fetchingMore: true }));
    try {
      const newQuestions = await fetchBatch();
      setState(s => {
        const event = rollEvent(s.round + 1);
        return {
          ...s,
          questions: [...s.questions, ...newQuestions],
          currentIndex: s.currentIndex + 1,
          selectedAnswer: null,
          questionStartTime: Date.now(),
          lastBonus: 0,
          hiddenAnswers: [],
          batchCorrect: 0,
          batchIndex: 0,
          round: s.round + 1,
          fetchingMore: false,
          activeEvent: event,
          showingEvent: !!event,
        };
      });
    } catch {
      // If fetch fails, end the game
      setState(s => endGame(s));
    }
  }, []);

  const nextQuestion = useCallback(() => {
    setState(s => {
      const isEndOfBatch = s.batchIndex >= BATCH_SIZE - 1;

      if (isEndOfBatch) {
        if (s.batchCorrect >= PASS_THRESHOLD) {
          // Player passed! We need to fetch more questions async
          // Set a flag and handle it outside setState
          return { ...s, fetchingMore: true, selectedAnswer: null };
        } else {
          // Failed batch — game over
          return endGame(s);
        }
      }

      // Normal next question within batch
      const event = rollEvent(s.round);
      return {
        ...s,
        currentIndex: s.currentIndex + 1,
        selectedAnswer: null,
        questionStartTime: event ? Date.now() : Date.now(),
        lastBonus: 0,
        hiddenAnswers: [],
        batchIndex: s.batchIndex + 1,
        activeEvent: event,
        showingEvent: !!event,
      };
    });
  }, []);

  // Handle async batch fetching when fetchingMore becomes true
  // We use a separate effect-like approach via the nextQuestion triggering loadNextBatch
  const handleNext = useCallback(() => {
    // Check if we need to fetch more
    const isEndOfBatch = state.batchIndex >= BATCH_SIZE - 1;
    const passed = state.batchCorrect >= PASS_THRESHOLD;

    if (isEndOfBatch && passed && state.selectedAnswer) {
      loadNextBatch();
    } else {
      nextQuestion();
    }
  }, [state.batchIndex, state.batchCorrect, state.selectedAnswer, loadNextBatch, nextQuestion]);

  const useFiftyFifty = useCallback(() => {
    setState(s => {
      if (s.usedFiftyFifty || s.selectedAnswer) return s;
      const q = s.questions[s.currentIndex];
      const wrong = q.incorrect_answers.filter(a => !s.hiddenAnswers.includes(a));
      const toHide = shuffleArray(wrong).slice(0, 2);
      return { ...s, usedFiftyFifty: true, hiddenAnswers: toHide };
    });
  }, []);

  const useSkip = useCallback(() => {
    setState(s => {
      if (s.usedSkip || s.selectedAnswer) return s;
      const isEndOfBatch = s.batchIndex >= BATCH_SIZE - 1;
      if (isEndOfBatch) {
        if (s.batchCorrect >= PASS_THRESHOLD) {
          return { ...s, usedSkip: true, fetchingMore: true, selectedAnswer: null };
        } else {
          return endGame({ ...s, usedSkip: true });
        }
      }
      const event = rollEvent(s.round);
      return {
        ...s,
        currentIndex: s.currentIndex + 1,
        selectedAnswer: null,
        questionStartTime: Date.now(),
        lastBonus: 0,
        hiddenAnswers: [],
        usedSkip: true,
        batchIndex: s.batchIndex + 1,
        activeEvent: event,
        showingEvent: !!event,
      };
    });
  }, []);

  return {
    ...state,
    batchSize: BATCH_SIZE,
    currentQuestion: state.questions[state.currentIndex],
    fetchQuestions,
    selectAnswer,
    nextQuestion: handleNext,
    timeUp,
    useFiftyFifty,
    useSkip,
    dismissEvent,
  };
}
