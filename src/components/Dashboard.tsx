import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { ChildProfile, Answer, GrowthReport } from '../types';
import { getAnswersByChild } from '../utils/storage';
import { generateGrowthReport } from '../utils/report';
import GrowthReportView from './GrowthReportView';
import DailyLogView from './DailyLogView';
import TextAnalysisReport from './TextAnalysisReport';

interface DashboardProps {
  child: ChildProfile;
}

export default function Dashboard({ child }: DashboardProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [report, setReport] = useState<GrowthReport | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [view, setView] = useState<'log' | 'report' | 'analysis'>('log');
  const [period, setPeriod] = useState<'7days' | '30days' | 'all'>('30days');

  useEffect(() => {
    const childAnswers = getAnswersByChild(child.id);
    setAnswers(childAnswers);

    // 최근 30일 리포트 생성
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const growthReport = generateGrowthReport(child.id, startDate, endDate);
    setReport(growthReport);
  }, [child]);

  const dailyAnswers = answers.filter(a => a.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('log')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              view === 'log'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            일일 로그
          </button>
          <button
            onClick={() => setView('report')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              view === 'report'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            성장 리포트
          </button>
          <button
            onClick={() => setView('analysis')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              view === 'analysis'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            텍스트 분석
          </button>
        </div>

        {view === 'log' ? (
          <DailyLogView
            answers={dailyAnswers}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        ) : view === 'report' ? (
          <GrowthReportView report={report} child={child} />
        ) : (
          <TextAnalysisReport
            child={child}
            answers={answers}
            period={period}
            onPeriodChange={setPeriod}
          />
        )}
      </div>
    </div>
  );
}

