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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600">
          리포트를 생성하기에 충분한 데이터가 없어요.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          조금 더 기록을 쌓아주세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {child.name}의 성장 리포트
        </h3>
        <p className="text-gray-600 text-sm">
          {format(new Date(report.period.start), 'yyyy년 MM월 dd일')} ~{' '}
          {format(new Date(report.period.end), 'yyyy년 MM월 dd일')}
        </p>
      </div>

      {report.emotionPatterns.length > 0 && (
        <div className="bg-primary-50 rounded-lg p-5">
          <h4 className="font-semibold text-gray-800 mb-3">감정 패턴</h4>
          <div className="space-y-2">
            {report.emotionPatterns.slice(0, 5).map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{pattern.emotion}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (pattern.frequency /
                            report.emotionPatterns[0].frequency) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {pattern.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.frequentWords.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-5">
          <h4 className="font-semibold text-gray-800 mb-3">자주 사용한 단어</h4>
          <div className="flex flex-wrap gap-2">
            {report.frequentWords.slice(0, 10).map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-blue-200"
              >
                {word.word} ({word.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {report.insights.length > 0 && (
        <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
          <h4 className="font-semibold text-gray-800 mb-3">성장 인사이트</h4>
          <ul className="space-y-2">
            {report.insights.map((insight, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.insights.length === 0 &&
        report.emotionPatterns.length === 0 &&
        report.frequentWords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            아직 분석할 데이터가 충분하지 않아요.
            <br />
            조금 더 기록을 쌓아주세요!
          </div>
        )}
    </div>
  );
}

