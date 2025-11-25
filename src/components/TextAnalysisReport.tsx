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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {child.name}의 성장 분석
        </h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as '7days' | '30days' | 'all')}
          className="px-5 py-2.5 border border-gray-300 rounded-airbnb focus:ring-2 focus:ring-airbnb-coral focus:border-airbnb-coral transition-all text-sm font-medium"
        >
          <option value="7days">최근 7일</option>
          <option value="30days">최근 30일</option>
          <option value="all">전체 기간</option>
        </select>
      </div>

      <div className="bg-airbnb-light rounded-airbnb-lg p-8 border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 text-lg">분석 요약</h4>
        <p className="text-gray-700 leading-relaxed font-light">{summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-airbnb p-6 border border-gray-200 shadow-sm hover:shadow-airbnb transition-all">
          <div className="text-3xl font-bold text-airbnb-coral mb-2">
            {analysis.totalAnswers}
          </div>
          <div className="text-sm text-gray-600 font-medium">총 답변 개수</div>
        </div>
        <div className="bg-white rounded-airbnb p-6 border border-gray-200 shadow-sm hover:shadow-airbnb transition-all">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Math.round(analysis.keywordRatios.positive * 100)}%
          </div>
          <div className="text-sm text-gray-600 font-medium">긍정 키워드 비율</div>
        </div>
        <div className="bg-white rounded-airbnb p-6 border border-gray-200 shadow-sm hover:shadow-airbnb transition-all">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Math.round(analysis.keywordRatios.challenge * 100)}%
          </div>
          <div className="text-sm text-gray-600 font-medium">도전 키워드 비율</div>
        </div>
      </div>

      {analysis.frequentWords.length > 0 && (
        <div className="bg-white rounded-airbnb-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-5 text-lg">가장 자주 나온 단어 상위 5개</h4>
          <div className="flex flex-wrap gap-3">
            {analysis.frequentWords.slice(0, 5).map((word, index) => (
              <div
                key={word.word}
                className="px-5 py-2.5 bg-airbnb-light text-airbnb-coral rounded-full font-semibold border border-airbnb-coral/20 shadow-sm"
              >
                <span className="text-airbnb-coral/70 mr-1.5">#{index + 1}</span>
                {word.word} <span className="text-gray-500 font-normal">({word.count}회)</span>
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



