import { GrowthReport } from '../types';
import { getAnswersByChild } from './storage';

export function generateGrowthReport(
  childId: string,
  startDate: string,
  endDate: string
): GrowthReport {
  const answers = getAnswersByChild(childId);
  const filteredAnswers = answers.filter(
    a => a.date >= startDate && a.date <= endDate
  );

  // 감정 패턴 분석
  const emotionMap = new Map<string, number>();
  filteredAnswers.forEach(answer => {
    if (answer.selectedOption) {
      const count = emotionMap.get(answer.selectedOption) || 0;
      emotionMap.set(answer.selectedOption, count + 1);
    }
    if (answer.text) {
      // 간단한 감정 키워드 추출 (실제로는 더 정교한 NLP 필요)
      const emotionKeywords = ['기쁨', '행복', '즐거움', '신남', '웃음', '화남', '슬픔', '걱정', '자랑', '멋짐'];
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

  // 자주 사용된 단어 분석
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
    insights.push(`가장 자주 나타난 감정은 "${topEmotion.emotion}"입니다. (${topEmotion.frequency}회)`);
  }

  if (frequentWords.length > 0) {
    const topWord = frequentWords[0];
    if (topWord.count >= 3) {
      insights.push(`"${topWord.word}"라는 단어가 자주 등장합니다. 이는 아이의 관심사나 생각의 중심을 보여줍니다.`);
    }
  }

  const answerCount = filteredAnswers.length;
  if (answerCount >= 20) {
    insights.push('꾸준히 기록하고 있어요. 아이의 성장 흐름을 잘 파악할 수 있습니다.');
  }

  // 해결 방법 관련 키워드 검색
  const solutionKeywords = ['해결', '방법', '다시', '노력', '시도'];
  const hasSolutionWords = filteredAnswers.some(answer => 
    answer.text && solutionKeywords.some(keyword => answer.text?.includes(keyword) || false)
  );
  
  if (hasSolutionWords) {
    insights.push('최근 "해결 방법"이나 "시도"라는 단어가 자주 등장합니다. 스스로 문제 해결 행동을 학습하고 있다는 신호입니다.');
  }

  return {
    childId,
    period: { start: startDate, end: endDate },
    emotionPatterns,
    frequentWords,
    insights,
  };
}

