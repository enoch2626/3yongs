import { Answer } from '../types';

// 조사, 접속사 등 불필요한 단어 제거
const STOP_WORDS = [
  '은', '는', '이', '가', '을', '를', '에', '의', '와', '과', '도', '로', '으로',
  '그리고', '그런데', '하지만', '그래서', '그러나', '또한', '또', '그리고',
  '있어요', '있었어요', '했어요', '했었어요', '해요', '했어', '했었어',
  '예', '예를', '들면', '같아요', '같은', '같이',
  '때', '때문', '때문에', '때문이에요',
  '것', '것이', '것을', '것을', '것도', '것으로',
  '오늘', '내일', '어제', '그때',
];

// 긍정 관련 키워드
const POSITIVE_KEYWORDS = [
  '기쁨', '기쁘', '즐거', '즐겁', '행복', '신나', '신남', '재미', '재밌',
  '좋아', '좋았', '멋져', '멋지', '자랑', '자랑스러', '뿌듯', '뿌듯해',
  '웃음', '웃었', '웃고', '웃어', '즐거워', '즐거웠',
];

// 부정 관련 키워드
const NEGATIVE_KEYWORDS = [
  '슬퍼', '슬프', '화나', '화났', '속상', '속상해', '답답', '답답해',
  '무서워', '무서웠', '무서운', '걱정', '걱정돼', '걱정됐',
  '힘들', '힘들어', '힘들었', '어려워', '어려웠', '어려운',
];

// 도전 관련 키워드
const CHALLENGE_KEYWORDS = [
  '도전', '시도', '해봤', '해봤어', '새로운', '새로', '처음',
  '어려웠', '어려운', '어려워', '해결', '해결했', '해결해',
  '노력', '노력했', '노력해', '열심히', '열심', '성장', '성장했',
  '배웠', '배워', '배운', '학습', '학습했',
];

export interface TextAnalysisResult {
  totalAnswers: number;
  frequentWords: Array<{ word: string; count: number }>;
  keywordRatios: {
    positive: number;
    negative: number;
    challenge: number;
  };
}

/**
 * 답변 배열을 분석하여 통계 정보를 반환합니다.
 * @param answers 분석할 답변 배열
 * @returns 분석 결과
 */
export function analyzeAnswers(answers: Answer[]): TextAnalysisResult {
  // 1. 총 답변 개수
  const totalAnswers = answers.length;

  // 2. 모든 텍스트를 합치고 단어 추출
  const allTexts = answers
    .map(a => a.text || a.selectedOption || '')
    .filter(text => text.length > 0)
    .join(' ');

  // 단어 추출 및 빈도 계산
  const words = extractWords(allTexts);
  const wordCounts = countWords(words);
  const frequentWords = Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 3. 키워드 비율 계산
  const keywordRatios = calculateKeywordRatios(allTexts);

  return {
    totalAnswers,
    frequentWords,
    keywordRatios,
  };
}

/**
 * 텍스트에서 단어를 추출합니다 (조사, 접속사 제외)
 */
function extractWords(text: string): string[] {
  // 한글, 영문, 숫자만 추출
  const cleaned = text.replace(/[^\w\s가-힣]/g, ' ');
  const words = cleaned
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1) // 1글자 단어 제외
    .filter(w => !STOP_WORDS.includes(w)); // 불필요한 단어 제외

  return words;
}

/**
 * 단어 빈도를 계산합니다
 */
function countWords(words: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  words.forEach(word => {
    const count = counts.get(word) || 0;
    counts.set(word, count + 1);
  });
  return counts;
}

/**
 * 키워드 비율을 계산합니다
 */
function calculateKeywordRatios(text: string): {
  positive: number;
  negative: number;
  challenge: number;
} {
  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  let challengeCount = 0;

  POSITIVE_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  NEGATIVE_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  CHALLENGE_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    const matches = lowerText.match(regex);
    if (matches) challengeCount += matches.length;
  });

  const totalKeywords = positiveCount + negativeCount + challengeCount;
  
  return {
    positive: totalKeywords > 0 ? positiveCount / totalKeywords : 0,
    negative: totalKeywords > 0 ? negativeCount / totalKeywords : 0,
    challenge: totalKeywords > 0 ? challengeCount / totalKeywords : 0,
  };
}

/**
 * 특정 기간의 답변을 필터링합니다
 */
export function filterAnswersByPeriod(
  answers: Answer[],
  fromDate: string,
  toDate: string
): Answer[] {
  return answers.filter(answer => {
    return answer.date >= fromDate && answer.date <= toDate;
  });
}

