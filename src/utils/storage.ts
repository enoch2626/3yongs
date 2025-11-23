import { Answer, ChildProfile, DailyLog } from '../types';

const STORAGE_KEYS = {
  PROFILES: '3yongs_profiles',
  ANSWERS: '3yongs_answers',
  LOGS: '3yongs_logs',
} as const;

export function saveChildProfile(profile: ChildProfile): void {
  const profiles = getChildProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function getChildProfiles(): ChildProfile[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return data ? JSON.parse(data) : [];
}

export function getChildProfile(id: string): ChildProfile | undefined {
  const profiles = getChildProfiles();
  return profiles.find(p => p.id === id);
}

export function saveAnswer(answer: Answer): void {
  const answers = getAllAnswers();
  const existingIndex = answers.findIndex(
    a => a.id === answer.id && a.date === answer.date
  );
  
  if (existingIndex >= 0) {
    answers[existingIndex] = answer;
  } else {
    answers.push(answer);
  }
  
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
}

export function getAllAnswers(): Answer[] {
  const data = localStorage.getItem(STORAGE_KEYS.ANSWERS);
  return data ? JSON.parse(data) : [];
}

export function getAnswersByChild(childId: string): Answer[] {
  const answers = getAllAnswers();
  return answers.filter(a => a.childId === childId);
}

export function getAnswersByDate(date: string, childId?: string): Answer[] {
  const answers = getAllAnswers();
  return answers.filter(a => {
    if (a.date !== date) return false;
    if (childId && a.childId !== childId) return false;
    return true;
  });
}

export function getDailyLog(date: string, childId: string): DailyLog | null {
  const answers = getAnswersByDate(date, childId);
  if (answers.length === 0) return null;
  
  return {
    date,
    answers,
    childId,
  };
}

