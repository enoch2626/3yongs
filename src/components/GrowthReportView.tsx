import { format } from 'date-fns';
import { ChildProfile, GrowthReport } from '../types';

interface GrowthReportViewProps {
  report: GrowthReport | null;
  child: ChildProfile;
}

export default function GrowthReportView({
  report,
  child,
}: GrowthReportViewProps) {
  if (!report) {
    return (
      <div className="text-center py-16">
        <div className="text-7xl mb-6">📊</div>
        <p className="text-gray-700 text-lg font-light mb-2">
          리포트를 생성하기에 충분한 데이터가 없어요.
        </p>
        <p className="text-gray-500 text-sm">
          조금 더 기록을 쌓아주세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
          {child.name}의 성장 리포트
        </h3>
        <p className="text-gray-600 text-sm font-light">
          {format(new Date(report.period.start), 'yyyy년 MM월 dd일')} ~{' '}
          {format(new Date(report.period.end), 'yyyy년 MM월 dd일')}
        </p>
      </div>

      {report.emotionPatterns.length > 0 && (
        <div className="bg-white rounded-airbnb-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">감정 패턴</h4>
          <div className="space-y-3">
            {report.emotionPatterns.slice(0, 5).map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{pattern.emotion}</span>
                <div className="flex items-center gap-3">
                  <div className="w-40 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-airbnb-coral h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (pattern.frequency /
                            report.emotionPatterns[0].frequency) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right font-semibold">
                    {pattern.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.frequentWords.length > 0 && (
        <div className="bg-white rounded-airbnb-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">자주 사용한 단어</h4>
          <div className="flex flex-wrap gap-2">
            {report.frequentWords.slice(0, 10).map((word, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-airbnb-light rounded-full text-sm text-gray-700 border border-gray-200 font-medium"
              >
                {word.word} <span className="text-gray-500">({word.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {report.insights.length > 0 && (
        <div className="bg-airbnb-light rounded-airbnb-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">성장 인사이트</h4>
          <ul className="space-y-3">
            {report.insights.map((insight, index) => (
              <li key={index} className="text-gray-700 flex items-start leading-relaxed">
                <span className="text-airbnb-coral mr-3 mt-1">•</span>
                <span className="font-light">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



