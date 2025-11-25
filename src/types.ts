export type AgeGroup = 5 | 8 | 11;

export type QuestionCategory = 'emotion' | 'learning' | 'tomorrow';

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  ageGroup: AgeGroup;
  options?: string[]; // 선택형 답변을 위한 옵션
  exampleGuide?: string; // 답변 예시 가이드
}

export interface Answer {
  id: string;
  questionId: string;
  childId: string;
  date: string; // YYYY-MM-DD 형식
  ageGroup: AgeGroup;
  text?: string;
  selectedOption?: string;
  audioUrl?: string; // 음성 답변의 경우
  timestamp: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  createdAt: number;
}

export interface DailyLog {
  date: string;
  answers: Answer[];
  childId: string;
}

export interface GrowthReport {
  childId: string;
  period: {
    start: string;
    end: string;
  };
  emotionPatterns: {
    emotion: string;
    frequency: number;
  }[];
  frequentWords: {
    word: string;
    count: number;
  }[];
  insights: string[];
}
