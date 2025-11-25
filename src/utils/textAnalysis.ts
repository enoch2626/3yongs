import { Answer } from '../types';
import { parseISO } from 'date-fns';

const stopWords = ['은', '는', '이', '가', '을', '를', '의', '에', '에서', '와', '과', '도', '로', '으로', '하고', '그리고', '그런데', '하지만', '그래서', '그러나', '그', '이', '저', '것', '수', '때', '때문', '것', '거', '게', '거야', '거예요', '어요', '아요', '해요', '했어요', '했어', '했', '했던', '했을', '했을까', '했을까요'];

const positiveKeywords = ['기쁨', '행복', '즐거움', '신남', '뿌듯', '자랑', '사랑', '고마움', '좋아', '좋았', '재미있', '재밌', '즐거', '행복', '기쁘', '신나', '뿌듯', '자랑스럽', '사랑', '고마', '감사'];
const negativeKeywords = ['슬픔', '화남', '무서움', '걱정', '피곤', '외로움', '슬프', '화나', '무서', '걱정', '피곤', '외로', '힘들', '어려', '짜증', '불안'];
const challengeKeywords = ['도전', '시도', '해봤', '해봤어', '시도했', '도전했', '새로운', '처음', '어려웠', '어려운', '해결', '해결했', '성공', '성공했', '배웠', '배운', '학습', '성장', '발전'];

export function filterAnswersByPeriod(
  answers: Answer[],
  fromDate: string,
  toDate: string
): Answer[] {
  return answers.filter(answer => {
    const answerDate = parseISO(answer.date);
    const from = parseISO(fromDate);
    const to = parseISO(toDate);
    return answerDate >= from && answerDate <= to;
  });
}

export function analyzeAnswers(answers: Answer[]) {
  const totalAnswers = answers.length;
  
  // 단어 빈도 분석
  const wordFrequency = new Map<string, number>();
  let totalWords = 0;

  answers.forEach(answer => {
    if (answer.text) {
      const words = answer.text
        .replace(/[^\w\s가-힣]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !stopWords.includes(w));
      
      words.forEach(word => {
        const count = wordFrequency.get(word) || 0;
        wordFrequency.set(word, count + 1);
        totalWords++;
      });
    }
  });

  // 키워드 비율 분석
  let positiveCount = 0;
  let negativeCount = 0;
  let challengeCount = 0;

  answers.forEach(answer => {
    if (answer.text) {
      const text = answer.text.toLowerCase();
      positiveKeywords.forEach(keyword => {
        if (text.includes(keyword)) positiveCount++;
      });
      negativeKeywords.forEach(keyword => {
        if (text.includes(keyword)) negativeCount++;
      });
      challengeKeywords.forEach(keyword => {
        if (text.includes(keyword)) challengeCount++;
      });
    }
  });

  return {
    totalAnswers,
    frequentWords: Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count })),
    keywordRatios: {
      positive: totalWords > 0 ? (positiveCount / totalWords) * 100 : 0,
      challenge: totalWords > 0 ? (challengeCount / totalWords) * 100 : 0,
      negative: totalWords > 0 ? (negativeCount / totalWords) * 100 : 0,
    },
  };
}



