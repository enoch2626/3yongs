import { format } from 'date-fns';
import { Answer } from '../types';
import { generateDailyQuestions } from '../utils/questionGenerator';

interface DailyLogViewProps {
  answers: Answer[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DailyLogView({
  answers,
  selectedDate,
  onDateChange,
}: DailyLogViewProps) {
  const ageGroup = answers.length > 0 ? answers[0].ageGroup : 5;
  const childId = answers.length > 0 ? answers[0].childId : 'default';
  const questions = generateDailyQuestions(ageGroup, selectedDate, childId);

  const getAnswersForQuestion = (questionId: string): Answer[] => {
    return answers
      .filter(a => a.questionId === questionId)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  if (answers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-7xl mb-6">📝</div>
        <p className="text-gray-700 text-xl mb-2 font-light">
          {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}에는
        </p>
        <p className="text-gray-500 mb-8">
          아직 기록이 없어요.
        </p>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-5 py-3 border border-gray-300 rounded-airbnb focus:ring-2 focus:ring-airbnb-coral focus:border-airbnb-coral transition-all"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-5 py-2.5 border border-gray-300 rounded-airbnb focus:ring-2 focus:ring-airbnb-coral focus:border-airbnb-coral transition-all text-sm"
        />
      </div>

      <div className="space-y-5">
        {questions.map((question) => {
          const questionAnswers = getAnswersForQuestion(question.id);
          if (questionAnswers.length === 0) return null;

          return (
            <div
              key={question.id}
              className="bg-white rounded-airbnb p-6 border border-gray-200 shadow-sm hover:shadow-airbnb transition-all"
            >
              <div className="font-semibold text-gray-900 mb-4 text-lg">
                {question.text}
              </div>
              <div className="space-y-4">
                {questionAnswers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`${index > 0 ? 'pt-4 border-t border-gray-100' : ''}`}
                  >
                    <div className="text-gray-700 leading-relaxed">
                      {answer.selectedOption ? (
                        <span className="inline-block px-4 py-1.5 bg-airbnb-light text-airbnb-coral rounded-full font-medium border border-airbnb-coral/20">
                          {answer.selectedOption}
                        </span>
                      ) : (
                        <p className="whitespace-pre-wrap">{answer.text}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 font-medium">
                      {format(new Date(answer.timestamp), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



