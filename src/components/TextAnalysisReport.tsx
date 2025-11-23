import { format, subDays } from 'date-fns';
import { ChildProfile, Answer } from '../types';
import { analyzeAnswers, filterAnswersByPeriod } from '../utils/textAnalysis';

interface TextAnalysisReportProps {
  child: ChildProfile;
  answers: Answer[];
  period: '7days' | '30days' | 'all';
  onPeriodChange: (period: '7days' | '30days' | 'all') => void;
}

export default function TextAnalysisReport({
  child,
  answers,
  period,
  onPeriodChange,
}: TextAnalysisReportProps) {
  // 기간 필터링
  const getFilteredAnswers = (): Answer[] => {
    if (period === 'all') {
      return answers;
    }

    const days = period === '7days' ? 7 : 30;
    const toDate = format(new Date(), 'yyyy-MM-dd');
    const fromDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

    return filterAnswersByPeriod(answers, fromDate, toDate);
  };

  const filteredAnswers = getFilteredAnswers();
  const analysis = analyzeAnswers(filteredAnswers);

  // 자연스러운 한국어 문장 생성
  const generateSummary = (): string => {
    if (filteredAnswers.length === 0) {
      return `${child.name}의 답변 데이터가 아직 충분하지 않습니다. 조금 더 기록을 쌓아주세요.`;
    }

    const periodText = period === '7days' ? '최근 7일' : period === '30days' ? '최근 30일' : '전체 기간';
    const topWords = analysis.frequentWords.slice(0, 3).map(w => `"${w.word}"`).join(', ');
    
    let summary = `${periodText} 동안 ${child.name}는 `;
    
    if (topWords) {
      summary += `주로 ${topWords} 같은 단어를 많이 사용했고, `;
    }

    // 키워드 비율에 따른 설명
    const { positive, negative, challenge } = analysis.keywordRatios;
    
    if (challenge > 0.3) {
      summary += '도전 관련 표현(어려웠다, 해냈다, 시도했다 등)이 자주 등장합니다. ';
    }
    
    if (positive > 0.4) {
      summary += '긍정적인 감정 표현이 많이 나타나고 있습니다. ';
    } else if (negative > 0.3) {
      summary += '부정적인 감정도 일부 나타나지만, ';
    }

    if (challenge > 0.2 && positive > 0.3) {
      summary += '어려움을 겪으면서도 긍정적으로 극복하려는 모습이 보입니다.';
    } else if (challenge > 0.2) {
      summary += '새로운 것에 도전하고 성장하는 모습이 보입니다.';
    } else if (positive > 0.3) {
      summary += '일상에서 즐거움과 행복을 많이 느끼고 있습니다.';
    } else {
      summary += '꾸준히 자신의 생각과 감정을 표현하고 있습니다.';
    }

    return summary;
  };

  const summary = generateSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {child.name}의 성장 분석
        </h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as '7days' | '30days' | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7days">최근 7일</option>
          <option value="30days">최근 30일</option>
          <option value="all">전체 기간</option>
        </select>
      </div>

      {/* 요약 정보 */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border-l-4 border-primary-500">
        <h4 className="font-semibold text-gray-800 mb-2">분석 요약</h4>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {analysis.totalAnswers}
          </div>
          <div className="text-sm text-gray-600">총 답변 개수</div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {Math.round(analysis.keywordRatios.positive * 100)}%
          </div>
          <div className="text-sm text-gray-600">긍정 키워드 비율</div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {Math.round(analysis.keywordRatios.challenge * 100)}%
          </div>
          <div className="text-sm text-gray-600">도전 키워드 비율</div>
        </div>
      </div>

      {/* 자주 사용한 단어 */}
      {analysis.frequentWords.length > 0 && (
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">가장 자주 나온 단어 상위 5개</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.frequentWords.slice(0, 5).map((word, index) => (
              <div
                key={word.word}
                className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium"
              >
                <span className="text-primary-500 mr-1">#{index + 1}</span>
                {word.word} ({word.count}회)
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredAnswers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          선택한 기간에 답변 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}

