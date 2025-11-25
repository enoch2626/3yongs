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

    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const growthReport = generateGrowthReport(child.id, startDate, endDate);
    setReport(growthReport);
  }, [child]);

  const dailyAnswers = answers.filter(a => a.date === selectedDate);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-airbnb-lg shadow-airbnb p-8 border border-gray-100">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setView('log')}
            className={`flex-1 py-3 rounded-airbnb font-semibold text-sm transition-all ${
              view === 'log'
                ? 'bg-airbnb-coral text-white shadow-airbnb'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm'
            }`}
          >
            일일 로그
          </button>
          <button
            onClick={() => setView('report')}
            className={`flex-1 py-3 rounded-airbnb font-semibold text-sm transition-all ${
              view === 'report'
                ? 'bg-airbnb-coral text-white shadow-airbnb'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm'
            }`}
          >
            성장 리포트
          </button>
          <button
            onClick={() => setView('analysis')}
            className={`flex-1 py-3 rounded-airbnb font-semibold text-sm transition-all ${
              view === 'analysis'
                ? 'bg-airbnb-coral text-white shadow-airbnb'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm'
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



