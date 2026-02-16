export interface Reflection {
  presence: number; // 1-5
  calm: number;
  wonder: number;
  note?: string;
}

export interface CompletedQuest {
  questId: number;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  reflection: Reflection;
  completedAt: string; // ISO
}

export interface AppState {
  completedQuests: CompletedQuest[];
}

const STORAGE_KEY = 'micro-rewilding';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedQuests: [] };
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addCompletedQuest(quest: CompletedQuest) {
  const state = loadState();
  state.completedQuests.push(quest);
  saveState(state);
  return state;
}

export function getStreak(): number {
  const state = loadState();
  const dates = [...new Set(state.completedQuests.map(q => q.date))].sort().reverse();
  if (dates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must include today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]).getTime();
    const prev = new Date(dates[i + 1]).getTime();
    if (curr - prev === 86400000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getWeeklyMinutes(): { day: string; minutes: number }[] {
  const state = loadState();
  const result: { day: string; minutes: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    const mins = state.completedQuests
      .filter(q => q.date === dateStr)
      .reduce((sum, q) => sum + q.durationMinutes, 0);
    result.push({ day: dayName, minutes: mins });
  }
  return result;
}

export function getWeeklyTotal(): number {
  return getWeeklyMinutes().reduce((sum, d) => sum + d.minutes, 0);
}

export function isTodayComplete(): boolean {
  const state = loadState();
  const today = new Date().toISOString().split('T')[0];
  return state.completedQuests.some(q => q.date === today);
}
