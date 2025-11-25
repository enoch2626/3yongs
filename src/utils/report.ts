import { GrowthReport } from '../types';
import { getAnswersByChild } from './storage';

const emotionKeywords = ['기쁨', '행복', '즐거움', '신남', '뿌듯', '자랑', '사랑', '고마움', '슬픔', '화남', '무서움', '걱정', '피곤', '외로움'];

export function generateGrowthReport(
  childId: string,
  startDate: string,
  endDate: string
): GrowthReport {
  const allAnswers = getAnswersByChild(childId);
  const filteredAnswers = allAnswers.filter(answer => {
    const answerDate = answer.date;
    return answerDate >= startDate && answerDate <= endDate;
  });

  // 감정 패턴 분석
  const emotionMap = new Map<string, number>();
  filteredAnswers.forEach(answer => {
    if (answer.text) {
      emotionKeywords.forEach(keyword => {
        if (answer.text && answer.text.includes(keyword)) {
          const count = emotionMap.get(keyword) || 0;
          emotionMap.set(keyword, count + 1);
        }
      });
    }
  });

  const emotionPatterns = Array.from(emotionMap.entries())
    .map(([emotion, frequency]) => ({ emotion, frequency }))
    .sort((a, b) => b.frequency - a.frequency);

  // 자주 사용한 단어 분석
  const wordMap = new Map<string, number>();
  filteredAnswers.forEach(answer => {
    if (answer.text) {
      const words = answer.text.split(/\s+/).filter(w => w.length > 1);
      words.forEach(word => {
        const count = wordMap.get(word) || 0;
        wordMap.set(word, count + 1);
      });
    }
  });

  const frequentWords = Array.from(wordMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 인사이트 생성
  const insights: string[] = [];
  if (emotionPatterns.length > 0) {
    const topEmotion = emotionPatterns[0];
    insights.push(`${topEmotion.emotion} 관련 표현이 자주 나타납니다.`);
  }
  if (frequentWords.length > 0) {
    insights.push(`"${frequentWords[0].word}"라는 단어를 자주 사용합니다.`);
  }
  if (filteredAnswers.length > 20) {
    insights.push('꾸준히 기록을 쌓고 있어요!');
  }

  return {
    childId,
    period: {
      start: startDate,
      end: endDate,
    },
    emotionPatterns,
    frequentWords,
    insights,
  };
}



